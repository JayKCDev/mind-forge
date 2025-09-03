import * as z from "zod";

// Course Editor Schemas - Updated with subCategory
export const courseSchema = z.object({
	courseTitle: z.string().min(1, "Title is required"),
	teacherName: z.string().min(1, "Teacher Name is required"),
	courseDescription: z.string().min(1, "Description is required"),
	courseCategory: z.string().min(1, "Category is required"),
	courseSubCategory: z.string().min(1, "Sub-category is required"),
	coursePrice: z.string(),
	courseStatus: z.boolean(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

// Explicit type definition to ensure TypeScript recognizes the fields
export interface CourseFormDataExplicit {
	courseTitle: string;
	teacherName: string;
	courseDescription: string;
	courseCategory: string;
	courseSubCategory: string;
	coursePrice: string;
	courseStatus: boolean;
}

// Chapter Schemas
export const chapterSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  video: z.union([z.string(), z.instanceof(File)]).optional(),
  preview: z.boolean().optional(),
});

export type ChapterFormData = z.infer<typeof chapterSchema>;

// Section Schemas
export const sectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type SectionFormData = z.infer<typeof sectionSchema>;

// Guest Checkout Schema
export const guestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type GuestFormData = z.infer<typeof guestSchema>;

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  courseNotifications: z.boolean(),
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  notificationFrequency: z.enum(["immediate", "daily", "weekly"]),
});

export type NotificationSettingsFormData = z.infer<
  typeof notificationSettingsSchema
>;

// Authentication Schemas
export const signupSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	userType: z.enum(["student", "teacher"], {
		required_error: "Please select a user type",
	}),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export type SigninFormData = z.infer<typeof signinSchema>;
