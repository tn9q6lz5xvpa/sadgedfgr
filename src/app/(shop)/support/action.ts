"use server";

import { z } from "zod";

const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactForm(formData: FormData) {
  const rawData = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(rawData);

  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((e) => e.message).join(", ");
    return { error: errorMessage };
  }

  const data = parsed.data;

  try {
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Create support ticket
    
    // For now, we'll just log it (replace with actual implementation)
    console.log("Support request received:", {
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // Simulate a slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { error: "Failed to send message. Please try again." };
  }
}