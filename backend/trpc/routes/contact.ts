import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECIPIENT_EMAIL = "brianjsantana3@gmail.com";

const DB_ENDPOINT = process.env.EXPO_PUBLIC_RORK_DB_ENDPOINT;
const DB_NAMESPACE = process.env.EXPO_PUBLIC_RORK_DB_NAMESPACE;
const DB_TOKEN = process.env.EXPO_PUBLIC_RORK_DB_TOKEN;

async function saveMessageToDatabase(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!DB_ENDPOINT || !DB_NAMESPACE || !DB_TOKEN) {
    console.log("[Contact] Database not configured, skipping storage");
    return null;
  }

  try {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageData = {
      id: messageId,
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const response = await fetch(`${DB_ENDPOINT}/kv/${DB_NAMESPACE}/contact_messages/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DB_TOKEN}`,
      },
      body: JSON.stringify(messageData),
    });

    if (response.ok) {
      console.log("[Contact] Message saved to database:", messageId);
      return messageId;
    } else {
      console.error("[Contact] Failed to save to database:", response.status);
      return null;
    }
  } catch (error) {
    console.error("[Contact] Database save error:", error);
    return null;
  }
}

export const contactRouter = createTRPCRouter({
  sendEmail: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        subject: z.string().min(1, "Subject is required"),
        message: z.string().min(1, "Message is required"),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Contact] Sending email from:", input.name, input.email);
      console.log("[Contact] Subject:", input.subject);
      console.log("[Contact] RESEND_API_KEY configured:", !!RESEND_API_KEY);
      
      // Always save to database first as backup
      const savedMessageId = await saveMessageToDatabase(input);
      console.log("[Contact] Message saved to DB:", savedMessageId);
      
      // If no Resend API key, still return success since message is saved
      if (!RESEND_API_KEY) {
        console.log("[Contact] No RESEND_API_KEY, but message saved to database");
        return { success: true, message: "Message received successfully", id: savedMessageId };
      }
      
      try {
        const emailPayload = {
          from: "Lawn Guardian <onboarding@resend.dev>",
          to: [RECIPIENT_EMAIL],
          subject: `[Lawn Guardian] ${input.subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${input.name}</p>
            <p><strong>Email:</strong> ${input.email}</p>
            <p><strong>Subject:</strong> ${input.subject}</p>
            <hr />
            <h3>Message:</h3>
            <p>${input.message.replace(/\n/g, '<br />')}</p>
          `,
          text: `New Contact Form Submission\n\nFrom: ${input.name}\nEmail: ${input.email}\nSubject: ${input.subject}\n\nMessage:\n${input.message}`,
          reply_to: input.email,
        };
        
        console.log("[Contact] Sending to Resend API...");
        
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify(emailPayload),
        });

        const responseText = await response.text();
        console.log("[Contact] Resend API response status:", response.status);
        console.log("[Contact] Resend API response body:", responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch {
          console.error("[Contact] Failed to parse response as JSON:", responseText);
          throw new Error("Invalid response from email service");
        }
        
        if (!response.ok) {
          console.error("[Contact] Resend API error:", response.status, responseData);
          const errorMessage = responseData?.message || responseData?.error || `HTTP ${response.status}`;
          throw new Error(`Email service error: ${errorMessage}`);
        }

        console.log("[Contact] Email sent successfully, id:", responseData.id);
        return { success: true, message: "Email sent successfully", id: responseData.id };
      } catch (error) {
        console.error("[Contact] Error sending email:", error);
        // Even if email fails, message is saved to database
        if (savedMessageId) {
          console.log("[Contact] Email failed but message saved to database");
          return { success: true, message: "Message received successfully", id: savedMessageId };
        }
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to send message. Please try again later.");
      }
    }),

  getMessages: publicProcedure.query(async () => {
    if (!DB_ENDPOINT || !DB_NAMESPACE || !DB_TOKEN) {
      return [];
    }

    try {
      const response = await fetch(`${DB_ENDPOINT}/kv/${DB_NAMESPACE}/contact_messages?prefix=`, {
        headers: {
          "Authorization": `Bearer ${DB_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.values || [];
      }
      return [];
    } catch (error) {
      console.error("[Contact] Error fetching messages:", error);
      return [];
    }
  }),
});
