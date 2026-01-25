import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECIPIENT_EMAIL = "info.lawnguardian@yahoo.com";

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
      
      if (!RESEND_API_KEY) {
        console.error("[Contact] RESEND_API_KEY is not configured");
        throw new Error("Email service is not configured. Please contact support.");
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
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to send email. Please try again later.");
      }
    }),
});
