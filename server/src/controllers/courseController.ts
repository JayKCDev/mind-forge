import { Request, Response } from "express";
import Course from "../models/courseModel";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import {
	isValidCategory,
	isValidSubCategory,
	isSubCategoryValidForCategory,
} from "../utils/categories";

const s3 = new AWS.S3();

export const listCourses = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { category, teacherId = null } = req.query;
	console.log("category", category, "teacherId", teacherId);
	try {
		let query = Course.scan(); // Start with a basic scan

		if (teacherId) {
			query = query.filter("teacherId").eq(teacherId); // Apply teacherId filter only if present
		}

		if (category && category !== "all") {
			query = query.filter("category").eq(category); // Apply category filter only if not "all"
		}

		const courses = await query.exec(); // Execute the query

		res.json({ message: "Courses retrieved successfully", data: courses });
	} catch (error) {
		res.status(500).json({ message: "Error retrieving courses", error });
	}
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
	const { courseId } = req.params;
	try {
		const course = await Course.get(courseId);
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}

		res.json({ message: "Course retrieved successfully", data: course });
	} catch (error) {
		res.status(500).json({ message: "Error retrieving course", error });
	}
};

export const createCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { teacherId, teacherName } = req.body;

		if (!teacherId || !teacherName) {
			res.status(400).json({ message: "Teacher Id and name are required" });
			return;
		}

		const newCourse = new Course({
			courseId: uuidv4(),
			teacherId,
			teacherName,
			title: "Untitled Course",
			description: "",
			shortDescription: "",
			category: "Development",
			subCategory: "Web Development",
			image: "",
			price: 0,
			level: "Beginner",
			status: "Draft",
			sections: [],
			enrollments: [],
			whatYoullLearn: [],
			requirements: [],
		});
		await newCourse.save();

		res.json({ message: "Course created successfully", data: newCourse });
	} catch (error) {
		res.status(500).json({ message: "Error creating course", error });
	}
};

export const updateCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { courseId } = req.params;
	const updateData = { ...req.body };
	const userId = req.user?.userId;

	try {
		const course = await Course.get(courseId);
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}

		if (course.teacherId !== userId) {
			res
				.status(403)
				.json({ message: "Not authorized to update this course " });
			return;
		}

		// Validate category and sub-category
		if (updateData.category || updateData.subCategory) {
			const category = updateData.category || course.category;
			const subCategory = updateData.subCategory || course.subCategory;

			if (!isValidCategory(category)) {
				res.status(400).json({
					message: "Invalid category",
					error:
						"Category must be one of: Development, Business, Design, Marketing",
				});
				return;
			}

			if (!isValidSubCategory(subCategory)) {
				res.status(400).json({
					message: "Invalid sub-category",
					error: "Sub-category is not valid",
				});
				return;
			}

			if (!isSubCategoryValidForCategory(category, subCategory)) {
				res.status(400).json({
					message: "Invalid category-subcategory combination",
					error: `Sub-category "${subCategory}" does not belong to category "${category}"`,
				});
				return;
			}
		}

		if (updateData.price) {
			const price = parseInt(updateData.price);
			if (isNaN(price)) {
				res.status(400).json({
					message: "Invalid price format",
					error: "Price must be a valid number",
				});
				return;
			}
			updateData.price = price * 100;
		}

		// Validate cover photo requirement for publishing
		if (updateData.status === "Published" && !course.image) {
			res.status(400).json({
				message: "Cover photo is required to publish a course",
				error: "COVER_PHOTO_REQUIRED",
			});
			return;
		}

		// Parse JSON string fields
		if (updateData.sections) {
			const sectionsData =
				typeof updateData.sections === "string"
					? JSON.parse(updateData.sections)
					: updateData.sections;

			updateData.sections = sectionsData.map((section: any) => ({
				...section,
				sectionId: section.sectionId || uuidv4(),
				chapters: section.chapters.map((chapter: any) => ({
					...chapter,
					chapterId: chapter.chapterId || uuidv4(),
				})),
			}));
		}

		// Parse whatYoullLearn array from JSON string
		if (updateData.whatYoullLearn) {
			updateData.whatYoullLearn =
				typeof updateData.whatYoullLearn === "string"
					? JSON.parse(updateData.whatYoullLearn)
					: updateData.whatYoullLearn;
		}

		// Parse requirements array from JSON string
		if (updateData.requirements) {
			updateData.requirements =
				typeof updateData.requirements === "string"
					? JSON.parse(updateData.requirements)
					: updateData.requirements;
		}

		Object.assign(course, updateData);
		await course.save();

		res.json({ message: "Course updated successfully", data: course });
	} catch (error) {
		res.status(500).json({ message: "Error updating course", error });
	}
};

export const deleteCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { courseId } = req.params;
	const userId = req.user?.userId;

	try {
		const course = await Course.get(courseId);
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}

		if (course.teacherId !== userId) {
			res
				.status(403)
				.json({ message: "Not authorized to delete this course " });
			return;
		}

		await Course.delete(courseId);

		res.json({ message: "Course deleted successfully", data: course });
	} catch (error) {
		res.status(500).json({ message: "Error deleting course", error });
	}
};

export const getUploadVideoUrl = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { fileName, fileType, courseId, sectionId } = req.body;

	if (!fileName || !fileType || !courseId || !sectionId) {
		res.status(400).json({
			message: "File name, type, course ID, and section ID are required",
		});
		return;
	}

	try {
		const s3Key = `videos/${courseId}/${sectionId}/${fileName}`;

		const s3Params = {
			Bucket: process.env.S3_BUCKET_NAME || "",
			Key: s3Key,
			Expires: 60,
			ContentType: fileType,
		};

		const uploadUrl = s3.getSignedUrl("putObject", s3Params);
		const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${courseId}/${sectionId}/${fileName}`;

		res.json({
			message: "Upload URL generated successfully",
			data: { uploadUrl, videoUrl },
		});
	} catch (error) {
		res.status(500).json({ message: "Error generating upload URL", error });
	}
};

export const getUploadCoverPhotoUrl = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { fileName, fileType, courseId, existingImageUrl } = req.body;

	if (!fileName || !fileType || !courseId) {
		res.status(400).json({
			message: "File name, type, and course ID are required",
		});
		return;
	}

	try {
		// Delete existing cover photo if provided
		if (existingImageUrl && existingImageUrl !== "/placeholder.png") {
			try {
				const urlParts = existingImageUrl.split("/");
				const existingFileName = urlParts[urlParts.length - 1];
				const existingS3Key = `covers/${courseId}/${existingFileName}`;

				await s3
					.deleteObject({
						Bucket: process.env.S3_BUCKET_NAME || "",
						Key: existingS3Key,
					})
					.promise();
			} catch (deleteError) {
				console.warn("Failed to delete existing cover photo:", deleteError);
				// Continue with upload even if delete fails
			}
		}

		// Generate upload URL for new cover photo
		const s3Key = `covers/${courseId}/${fileName}`;

		const s3Params = {
			Bucket: process.env.S3_BUCKET_NAME || "",
			Key: s3Key,
			Expires: 60,
			ContentType: fileType,
		};

		const uploadUrl = s3.getSignedUrl("putObject", s3Params);
		const coverPhotoUrl = `${process.env.CLOUDFRONT_DOMAIN}/covers/${courseId}/${fileName}`;

		res.json({
			message: "Cover photo upload URL generated successfully",
			data: { uploadUrl, coverPhotoUrl },
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error generating cover photo upload URL", error });
	}
};
