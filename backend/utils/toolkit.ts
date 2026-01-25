import * as z from "zod";

const TOOLKIT_URL = process.env.EXPO_PUBLIC_TOOLKIT_URL || "https://toolkit.rork.com";

type TextPart = { type: "text"; text: string };
type ImagePart = { type: "image"; image: string };
type UserMessage = { role: "user"; content: string | (TextPart | ImagePart)[] };
type AssistantMessage = { role: "assistant"; content: string | TextPart[] };

export async function generateObject<T extends z.ZodType>(params: {
  messages: (UserMessage | AssistantMessage)[];
  schema: T;
}): Promise<z.infer<T>> {
  console.log("[toolkit] Calling generateObject API");
  
  const response = await fetch(`${TOOLKIT_URL}/agent/object`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: params.messages,
      schema: zodToJsonSchema(params.schema),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[toolkit] API error:", response.status, errorText);
    throw new Error(`Toolkit API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("[toolkit] Response received successfully");
  return data;
}

export async function generateText(
  params: string | { messages: (UserMessage | AssistantMessage)[] }
): Promise<string> {
  console.log("[toolkit] Calling generateText API");
  
  const messages = typeof params === "string" 
    ? [{ role: "user" as const, content: params }]
    : params.messages;

  const response = await fetch(`${TOOLKIT_URL}/agent/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[toolkit] API error:", response.status, errorText);
    throw new Error(`Toolkit API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("[toolkit] Response received successfully");
  return typeof data === "string" ? data : data.text || data.content || "";
}

function zodToJsonSchema(schema: z.ZodType): Record<string, unknown> {
  return convertZodToJsonSchema(schema);
}

function convertZodToJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const def = schema._def as any;
  const typeName = def?.typeName as string | undefined;

  switch (typeName) {
    case "ZodString":
      return { type: "string", description: def.description };
    case "ZodNumber":
      const numSchema: Record<string, unknown> = { type: "number", description: def.description };
      if (def.checks) {
        for (const check of def.checks) {
          if (check.kind === "min") numSchema.minimum = check.value;
          if (check.kind === "max") numSchema.maximum = check.value;
        }
      }
      return numSchema;
    case "ZodBoolean":
      return { type: "boolean", description: def.description };
    case "ZodArray":
      return {
        type: "array",
        items: convertZodToJsonSchema(def.type),
        description: def.description,
      };
    case "ZodObject":
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
      const shape = def.shape();
      for (const [key, value] of Object.entries(shape)) {
        properties[key] = convertZodToJsonSchema(value as z.ZodType);
        if (!(((value as z.ZodType)._def as any)?.typeName === "ZodOptional")) {
          required.push(key);
        }
      }
      return {
        type: "object",
        properties,
        required: required.length > 0 ? required : undefined,
        description: def.description,
      };
    case "ZodEnum":
      return {
        type: "string",
        enum: def.values,
        description: def.description,
      };
    case "ZodOptional":
      return convertZodToJsonSchema(def.innerType);
    case "ZodNullable":
      const inner = convertZodToJsonSchema(def.innerType);
      return { ...inner, nullable: true };
    default:
      return { description: def?.description };
  }
}
