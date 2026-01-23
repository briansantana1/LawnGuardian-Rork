import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const TOOLKIT_URL = process.env.EXPO_PUBLIC_TOOLKIT_URL || "https://toolkit.rork.com";

type ZodSchema = z.ZodType<unknown>;

interface GenerateObjectParams {
  messages: Array<{
    role: "user" | "assistant";
    content: string | Array<{ type: "text"; text: string } | { type: "image"; image: string }>;
  }>;
  schema: ZodSchema;
}

async function generateObject<T>(params: GenerateObjectParams): Promise<T> {
  console.log("[generateObject] Calling toolkit API at:", TOOLKIT_URL);
  
  const schemaJson = zodToJsonSchema(params.schema);
  
  const response = await fetch(`${TOOLKIT_URL}/agent/object`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: params.messages,
      schema: schemaJson,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[generateObject] API error:", response.status, errorText);
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("[generateObject] Response received");
  return result as T;
}

function zodToJsonSchema(schema: ZodSchema): object {
  const def = (schema as { _def?: { typeName?: string; shape?: () => Record<string, ZodSchema>; values?: string[]; checks?: Array<{ kind: string; value?: number }>; innerType?: ZodSchema; description?: string } })._def;
  if (!def) return { type: "object" };
  
  const typeName = def.typeName;
  const description = def.description;
  
  const addDescription = (obj: object): object => {
    if (description) return { ...obj, description };
    return obj;
  };
  
  switch (typeName) {
    case "ZodString":
      return addDescription({ type: "string" });
    case "ZodNumber": {
      const result: { type: string; minimum?: number; maximum?: number } = { type: "number" };
      def.checks?.forEach((check: { kind: string; value?: number }) => {
        if (check.kind === "min" && check.value !== undefined) result.minimum = check.value;
        if (check.kind === "max" && check.value !== undefined) result.maximum = check.value;
      });
      return addDescription(result);
    }
    case "ZodBoolean":
      return addDescription({ type: "boolean" });
    case "ZodEnum":
      return addDescription({ type: "string", enum: def.values });
    case "ZodArray":
      return addDescription({ type: "array", items: def.innerType ? zodToJsonSchema(def.innerType) : {} });
    case "ZodObject": {
      const shape = def.shape?.() || {};
      const properties: Record<string, object> = {};
      const required: string[] = [];
      for (const [key, value] of Object.entries(shape)) {
        properties[key] = zodToJsonSchema(value as ZodSchema);
        const valueDef = (value as { _def?: { typeName?: string } })._def;
        if (valueDef?.typeName !== "ZodOptional") {
          required.push(key);
        }
      }
      return addDescription({ type: "object", properties, required });
    }
    case "ZodOptional":
      return def.innerType ? zodToJsonSchema(def.innerType) : {};
    default:
      return addDescription({ type: "string" });
  }
}

const LawnAnalysisSchema = z.object({
  diagnosis: z.string().describe("Primary diagnosis of the lawn problem"),
  severity: z.enum(["mild", "moderate", "severe"]).describe("Severity level of the issue"),
  confidence: z.number().min(0).max(100).describe("Confidence percentage of the diagnosis"),
  issues: z.array(z.object({
    name: z.string().describe("Name of the identified issue"),
    description: z.string().describe("Brief description of the issue"),
    type: z.enum(["disease", "pest", "weed", "nutrient_deficiency", "environmental", "other"]).describe("Type of issue"),
  })).describe("List of identified issues"),
  healthScore: z.number().min(0).max(100).describe("Overall lawn health score"),
  treatment: z.object({
    immediate: z.array(z.string()).describe("Immediate actions to take"),
    shortTerm: z.array(z.string()).describe("Short-term treatment steps (1-2 weeks)"),
    longTerm: z.array(z.string()).describe("Long-term maintenance recommendations"),
    products: z.array(z.object({
      name: z.string(),
      purpose: z.string(),
      applicationTiming: z.string(),
    })).describe("Recommended products"),
  }).describe("Treatment plan"),
  preventionTips: z.array(z.string()).describe("Prevention tips for future"),
});

const SavedPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  diagnosis: z.string(),
  treatment: z.string(),
  createdAt: z.string(),
  imageUrl: z.string().optional(),
  fullAnalysis: LawnAnalysisSchema.optional(),
});

export const lawnRouter = createTRPCRouter({
  analyzeLawn: publicProcedure
    .input(z.object({
      imageBase64: z.string().describe("Base64 encoded lawn image"),
      grassType: z.string().describe("Type of grass in the lawn"),
      location: z.string().optional().describe("User location for climate context"),
      additionalNotes: z.string().optional().describe("Any additional context from user"),
    }))
    .mutation(async ({ input }) => {
      console.log("[analyzeLawn] Starting analysis for grass type:", input.grassType);
      console.log("[analyzeLawn] Image data length:", input.imageBase64.length);
      
      const systemPrompt = `You are an expert lawn care specialist and plant pathologist. Analyze the provided lawn image and identify any issues, diseases, pests, weeds, or problems.

Context:
- Grass Type: ${input.grassType}
${input.location ? `- Location: ${input.location}` : ""}
${input.additionalNotes ? `- Additional Notes: ${input.additionalNotes}` : ""}

Provide a comprehensive analysis including:
1. Primary diagnosis of any visible problems
2. Severity assessment
3. Detailed treatment plan with immediate, short-term, and long-term recommendations
4. Product recommendations specific to the grass type
5. Prevention tips for future lawn health

Be specific and actionable in your recommendations. Consider the grass type when suggesting treatments.`;

      try {
        console.log("[analyzeLawn] Calling AI generateObject...");
        const analysis = await generateObject({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: systemPrompt },
                { type: "image", image: input.imageBase64 },
              ],
            },
          ],
          schema: LawnAnalysisSchema,
        });

        console.log("[analyzeLawn] Analysis completed successfully:", analysis.diagnosis);
        
        return {
          success: true,
          analysis,
          analyzedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("[analyzeLawn] Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to analyze lawn image: ${errorMessage}`);
      }
    }),

  getLawnHealth: publicProcedure
    .input(z.object({
      imageBase64: z.string().describe("Base64 encoded lawn image"),
      grassType: z.string().describe("Type of grass"),
    }))
    .mutation(async ({ input }) => {
      console.log("Getting lawn health score for:", input.grassType);

      const healthSchema = z.object({
        overallScore: z.number().min(0).max(100),
        moisture: z.number().min(0).max(100),
        grassDensity: z.number().min(0).max(100),
        colorHealth: z.number().min(0).max(100),
        weedLevel: z.number().min(0).max(100).describe("0 = no weeds, 100 = heavily infested"),
        summary: z.string().describe("Brief summary of lawn health"),
        recommendations: z.array(z.string()).describe("Top 3 recommendations"),
      });

      try {
        const health = await generateObject({
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: `Analyze this lawn image and provide health metrics. Grass type: ${input.grassType}. Evaluate moisture levels, grass density, color health, and weed presence. Provide an overall health score and brief recommendations.` 
                },
                { type: "image", image: input.imageBase64 },
              ],
            },
          ],
          schema: healthSchema,
        });

        console.log("Lawn health score:", health.overallScore);
        
        return {
          success: true,
          health,
          lastUpdated: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Lawn health error:", error);
        throw new Error("Failed to assess lawn health. Please try again.");
      }
    }),

  identifyPlant: publicProcedure
    .input(z.object({
      imageBase64: z.string().describe("Base64 encoded plant/weed image"),
    }))
    .mutation(async ({ input }) => {
      console.log("Identifying plant from image");

      const plantSchema = z.object({
        name: z.string().describe("Common name of the plant/weed"),
        scientificName: z.string().describe("Scientific name"),
        type: z.enum(["grass", "weed", "flower", "shrub", "unknown"]),
        isInvasive: z.boolean(),
        description: z.string(),
        removalMethod: z.string().optional().describe("How to remove if it's a weed"),
        toxicity: z.enum(["non-toxic", "mildly-toxic", "toxic", "highly-toxic", "unknown"]),
      });

      try {
        const plant = await generateObject({
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: "Identify this plant or weed. Provide its common name, scientific name, whether it's invasive, and if it's a weed, how to remove it safely. Also note any toxicity concerns for pets or children." 
                },
                { type: "image", image: input.imageBase64 },
              ],
            },
          ],
          schema: plantSchema,
        });

        console.log("Plant identified:", plant.name);
        
        return {
          success: true,
          plant,
          identifiedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Plant identification error:", error);
        throw new Error("Failed to identify plant. Please try again.");
      }
    }),

  getSeasonalTasks: publicProcedure
    .input(z.object({
      grassType: z.string(),
      location: z.string().optional(),
      currentMonth: z.number().min(1).max(12),
    }))
    .query(async ({ input }) => {
      console.log("Getting seasonal tasks for:", input.grassType, "month:", input.currentMonth);

      const tasksSchema = z.object({
        season: z.string(),
        tasks: z.array(z.object({
          title: z.string(),
          description: z.string(),
          priority: z.enum(["low", "medium", "high"]),
          category: z.enum(["mowing", "watering", "fertilizing", "weeding", "aerating", "seeding", "pest_control", "other"]),
          timing: z.string().describe("When to do this task"),
        })),
        tips: z.array(z.string()),
      });

      try {
        const seasonalData = await generateObject({
          messages: [
            {
              role: "user",
              content: `Generate seasonal lawn care tasks for ${input.grassType} grass in month ${input.currentMonth}${input.location ? ` in ${input.location}` : ""}. Include specific tasks with priorities and timing, plus seasonal tips.`,
            },
          ],
          schema: tasksSchema,
        });

        console.log("Seasonal tasks generated for season:", seasonalData.season);
        
        return {
          success: true,
          ...seasonalData,
          generatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Seasonal tasks error:", error);
        throw new Error("Failed to generate seasonal tasks. Please try again.");
      }
    }),

  getWateringSchedule: publicProcedure
    .input(z.object({
      grassType: z.string(),
      lawnSize: z.number().describe("Lawn size in square feet"),
      soilType: z.enum(["clay", "sandy", "loamy", "silty"]).optional(),
      sunExposure: z.enum(["full-sun", "partial-shade", "full-shade"]).optional(),
    }))
    .query(async ({ input }) => {
      console.log("Generating watering schedule for:", input.grassType);

      const scheduleSchema = z.object({
        frequency: z.string().describe("How often to water"),
        duration: z.string().describe("How long to water each session"),
        bestTime: z.string().describe("Best time of day to water"),
        amountPerWeek: z.string().describe("Total water needed per week in inches"),
        tips: z.array(z.string()),
        seasonalAdjustments: z.object({
          summer: z.string(),
          fall: z.string(),
          winter: z.string(),
          spring: z.string(),
        }),
      });

      try {
        const schedule = await generateObject({
          messages: [
            {
              role: "user",
              content: `Create an optimal watering schedule for ${input.grassType} grass. Lawn size: ${input.lawnSize} sq ft${input.soilType ? `, soil type: ${input.soilType}` : ""}${input.sunExposure ? `, sun exposure: ${input.sunExposure}` : ""}. Include frequency, duration, best timing, and seasonal adjustments.`,
            },
          ],
          schema: scheduleSchema,
        });

        console.log("Watering schedule generated");
        
        return {
          success: true,
          schedule,
          generatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Watering schedule error:", error);
        throw new Error("Failed to generate watering schedule. Please try again.");
      }
    }),
});
