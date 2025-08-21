import { z } from "zod";

// User schemas
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Member schemas
export const createMemberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .optional()
    .or(z.literal("")),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  departmentOfInterest: z.string().optional().or(z.literal("")),
  joinedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),
  photo: z.string().url("Invalid photo URL").optional().or(z.literal("")),
});

export const updateMemberSchema = createMemberSchema.partial();

// HOT (Head of Tribe) schemas
export const createHotSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  tribe: z.string().min(1, "Tribe is required"),
  photo: z.string().url("Invalid photo URL").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export const updateHotSchema = createHotSchema.partial();

export { registerSchema, loginSchema };

// birthday: z.string().datetime({ offset: true }).optional().or(z.literal("")),
// birthday: z.iso.datetime({ local: true }).optional().or(z.literal("")),
