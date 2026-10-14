import { z } from "zod";

// Safe to import in the browser: the contact form validates with the same rules as the API.

/** Topics a visitor can pick on the contact form. Shared by the form, the API and the admin inbox. */
export const CONTACT_TOPICS = [
  "General question",
  "Product or skin advice",
  "An order or a purchase",
  "Wholesale and stockists",
  "Press and partnerships",
] as const;

export const CONTACT_LIMITS = { name: 100, email: 320, phone: 30, message: 2000, messageMin: 10 } as const;

const optionalPhone = z.preprocess(
  (value) => (typeof value === "string" && value.trim() ? value.trim() : undefined),
  z.string().max(CONTACT_LIMITS.phone, "That phone number is too long.").regex(/^[+\d][\d\s()-]{5,}$/, "Enter a valid phone number, or leave it empty.").optional(),
);

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(CONTACT_LIMITS.name, "That name is too long."),
  email: z.string().trim().toLowerCase().max(CONTACT_LIMITS.email, "That email is too long.").email("Enter a valid email address."),
  phone: optionalPhone,
  topic: z.enum(CONTACT_TOPICS, { message: "Choose what your message is about." }),
  message: z.string().trim().min(CONTACT_LIMITS.messageMin, `Please write at least ${CONTACT_LIMITS.messageMin} characters.`).max(CONTACT_LIMITS.message, `Please keep your message under ${CONTACT_LIMITS.message} characters.`),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type ContactField = keyof ContactMessageInput;
