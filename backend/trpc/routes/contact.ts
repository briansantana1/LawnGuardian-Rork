import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const TOOLKIT_URL = process.env.EXPO_PUBLIC_TOOLKIT_URL || "https://toolkit.rork.com";

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
      
      try {
        const response = await fetch(`${TOOLKIT_URL}/email/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: "info.lawnguardian@yahoo.com",
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
            replyTo: input.email,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[Contact] Email API error:", response.status, errorText);
          throw new Error(`Failed to send email: ${response.status}`);
        }

        console.log("[Contact] Email sent successfully");
        return { success: true, message: "Email sent successfully" };
      } catch (error) {
        console.error("[Contact] Error sending email:", error);
        throw new Error("Failed to send email. Please try again later.");
      }
    }),
});
