import { z } from "zod";

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  tribe: z.string().min(1, "Tribe is required"),
  bio: z.string().optional(),
  photo: z.string().url().optional(),
  phone: z.string().optional(),
});

export const updateSchema = registerSchema.partial();

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Member schemas
export const createMemberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required").optional().or(z.literal("")),
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

// Sermon schemas
export const createSermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  spotifyEmbedUrl: z.string().url("Invalid Spotify embed URL").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  speaker: z.string().optional().or(z.literal("")),
});

export const updateSermonSchema = createSermonSchema.partial();

export const createPrSchema = z
  .object({
    fullName: z.string().optional().or(z.literal("")),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    message: z.string().min(1, "Message is required"),
    anonymous: z.boolean().optional().default(false),
    status: z.enum(["new", "read", "resolved"]).optional().default("new"),
  })
  .superRefine((v, ctx) => {
    if (!v.anonymous) {
      if (!v.fullName || v.fullName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fullName"],
          message: "Full name is required",
        });
      }
      if (!v.email || v.email.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "Email is required",
        });
      }
    }
  });

export const updatePrSchema = createPrSchema.partial();

export const createTestimonySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  message: z.string().min(1, "Message is required"),
  anonymous: z.boolean().optional(),
  status: z.enum(["new", "read", "resolved"]).optional(),
});

export const updateTestimonySchema = createTestimonySchema.partial();

// // HOT (Head of Tribe) schemas
// export const createHotSchema = z.object({
//   fullName: z.string().min(1, "Name is required"),
//   tribe: z.string().min(1, "Tribe is required"),
//   photo: z.string().url("Invalid photo URL").optional().or(z.literal("")),
//   phone: z.string().optional().or(z.literal("")),
//   email: z.string().email("Invalid email address").optional().or(z.literal("")),
// });

// export const updateHotSchema = createHotSchema.partial();

// export { registerSchema, loginSchema };

// birthday: z.string().datetime({ offset: true }).optional().or(z.literal("")),
// birthday: z.iso.datetime({ local: true }).optional().or(z.literal("")),
