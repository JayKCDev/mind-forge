"use client";

import { CustomFormField } from "@/components/CustomFormField";
import DynamicArrayInput from "@/components/DynamicArrayInput";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	courseSchema,
	CourseFormData,
	CourseFormDataExplicit,
} from "@/lib/schemas";
import {
	centsToDollars,
	createCourseFormData,
	uploadAllVideos,
	uploadCoverPhotoToS3,
	courseCategories,
	courseSubCategories,
} from "@/lib/utils";
import { openSectionModal, setSections } from "@/state";
import {
	useGetCourseQuery,
	useUpdateCourseMutation,
	useGetUploadVideoUrlMutation,
	useGetUploadCoverPhotoUrlMutation,
} from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DroppableComponent from "./Droppable";
import ChapterModal from "./ChapterModal";
import SectionModal from "./SectionModal";

const CourseEditor = () => {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;
	const { data: course, isLoading, refetch } = useGetCourseQuery(id);
	const [updateCourse] = useUpdateCourseMutation();
	const [getUploadVideoUrl] = useGetUploadVideoUrlMutation();
	const [getUploadCoverPhotoUrl] = useGetUploadCoverPhotoUrlMutation();

	const dispatch = useAppDispatch();
	const { sections } = useAppSelector((state) => state.global.courseEditor);

	// Local state for cover photo
	const [localCoverPhoto, setLocalCoverPhoto] = useState<File | null>(null);
	const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
		null,
	);

	const methods = useForm<CourseFormDataExplicit>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			courseTitle: "",
			teacherName: "",
			courseDescription: "",
			courseCategory: "",
			courseSubCategory: "",
			coursePrice: "0",
			courseStatus: false,
			whatYoullLearn: [""],
			requirements: [""],
		} as CourseFormDataExplicit,
	});

	// Watch the selected category to update sub-category options
	const selectedCategory = methods.watch("courseCategory");

	// Debug logging
	console.log("Selected category:", selectedCategory);
	console.log(
		"Available sub-categories:",
		selectedCategory
			? courseSubCategories[
					selectedCategory as keyof typeof courseSubCategories
				]
			: "No category selected",
	);
	console.log("All courseSubCategories:", courseSubCategories);

	useEffect(() => {
		if (course) {
			methods.reset({
				courseTitle: course.title,
				teacherName: course.teacherName,
				courseDescription: course.description,
				courseCategory: course.category,
				courseSubCategory: course.subCategory,
				coursePrice: centsToDollars(course.price),
				courseStatus: course.status === "Published",
				whatYoullLearn: course.whatYoullLearn || [""],
				requirements: course.requirements || [""],
			} as CourseFormDataExplicit);
			dispatch(setSections(course.sections || []));
		}
	}, [course, methods]); // eslint-disable-line react-hooks/exhaustive-deps

	// Clear sub-category when category changes
	useEffect(() => {
		if (selectedCategory) {
			// Check if current sub-category is valid for the selected category
			const validSubCategories =
				courseSubCategories[
					selectedCategory as keyof typeof courseSubCategories
				];
			const currentSubCategory = methods.getValues("courseSubCategory");

			if (currentSubCategory && validSubCategories) {
				const isValidSubCategory = validSubCategories.some(
					(sub) => sub.value === currentSubCategory,
				);
				if (!isValidSubCategory) {
					methods.setValue("courseSubCategory", "");
				}
			}
		}
	}, [selectedCategory, methods]);

	// Cleanup preview URL on unmount
	useEffect(() => {
		return () => {
			if (coverPhotoPreview) {
				URL.revokeObjectURL(coverPhotoPreview);
			}
		};
	}, [coverPhotoPreview]);

	const handleCoverPhotoUpload = (file: File) => {
		// Store the file locally and create a preview
		setLocalCoverPhoto(file);

		// Create a preview URL for the image
		const previewUrl = URL.createObjectURL(file);
		setCoverPhotoPreview(previewUrl);

		toast.success("Cover photo selected. Click 'Save' to upload.");
	};

	const handleCoverPhotoRemove = () => {
		// Clear local cover photo
		setLocalCoverPhoto(null);
		if (coverPhotoPreview) {
			URL.revokeObjectURL(coverPhotoPreview);
			setCoverPhotoPreview(null);
		}
		toast.success("Cover photo removed. Click 'Save' to apply changes.");
	};

	const onSubmit = async (data: CourseFormDataExplicit) => {
		try {
			// Upload videos first
			const updatedSections = await uploadAllVideos(
				sections,
				id,
				getUploadVideoUrl,
			);

			// Handle cover photo upload/replacement
			let coverPhotoUrl = course?.image;

			if (localCoverPhoto) {
				// Upload the new cover photo (backend will handle deleting existing one)
				coverPhotoUrl = await uploadCoverPhotoToS3(
					localCoverPhoto,
					id,
					getUploadCoverPhotoUrl,
					course?.image, // Pass existing image URL for deletion
				);

				// Clear local state
				setLocalCoverPhoto(null);
				if (coverPhotoPreview) {
					URL.revokeObjectURL(coverPhotoPreview);
					setCoverPhotoPreview(null);
				}
			}

			const formData = createCourseFormData(data, updatedSections);

			// Add cover photo URL to form data if we have one
			if (coverPhotoUrl) {
				formData.append("image", coverPhotoUrl);
			}

			await updateCourse({
				courseId: id,
				formData,
			}).unwrap();

			toast.success("Course updated successfully!");
			refetch();
		} catch (error) {
			console.error("Failed to update course:", error);
			toast.error("Failed to update course. Please try again.");
		}
	};

	return (
		<div>
			<div className="flex items-center gap-5 mb-5">
				<button
					className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
					onClick={() => router.push("/teacher/courses", { scroll: false })}
				>
					<ArrowLeft className="w-4 h-4" />
					<span>Back to Courses</span>
				</button>
			</div>

			<Form {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<Header
						title="Course Setup"
						subtitle="Complete all fields and save your course"
						rightElement={
							<div className="flex flex-col items-end space-y-2">
								<div className="flex items-center space-x-4">
									<CustomFormField
										name="courseStatus"
										label={
											methods.watch("courseStatus") ? "Published" : "Draft"
										}
										type="switch"
										className="flex items-center space-x-2"
										labelClassName={`text-sm font-medium ${
											methods.watch("courseStatus")
												? "text-green-500"
												: "text-yellow-500"
										}`}
										inputClassName="data-[state=checked]:bg-green-500"
									/>
									<Button
										type="submit"
										className="bg-primary-700 hover:bg-primary-600"
										disabled={
											methods.watch("courseStatus") &&
											!localCoverPhoto &&
											(!course?.image || course.image === "/placeholder.png")
										}
									>
										{methods.watch("courseStatus")
											? "Update Published Course"
											: "Save Draft"}
									</Button>
								</div>

								{/* Cover Photo Warning */}
								{methods.watch("courseStatus") &&
									!localCoverPhoto &&
									(!course?.image || course.image === "/placeholder.png") && (
										<div className="text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-md">
											⚠️ Cover photo required to publish course
										</div>
									)}
							</div>
						}
					/>

					<div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
						<div className="basis-1/2">
							<div className="space-y-4">
								<CustomFormField
									name="teacherName"
									label="Teacher's Name"
									type="text"
									placeholder="Teacher's Name"
									className="border-none"
									initialValue={course?.teacherName}
								/>

								<CustomFormField
									name="courseTitle"
									label="Course Title"
									type="text"
									placeholder="Write course title here"
									className="border-none"
									initialValue={course?.title}
								/>

								<CustomFormField
									name="courseDescription"
									label="Course Description"
									type="textarea"
									placeholder="Write course description here"
									initialValue={course?.description}
								/>

								<CustomFormField
									name="courseCategory"
									label="Course Category"
									type="select"
									placeholder="Select category here"
									options={[...courseCategories]}
									initialValue={course?.category}
								/>

								<CustomFormField
									name="courseSubCategory"
									label="Course Sub-Category"
									type="select"
									placeholder={
										selectedCategory
											? "Select sub-category here"
											: "Select a category first"
									}
									options={(() => {
										const subCategories =
											selectedCategory &&
											courseSubCategories[
												selectedCategory as keyof typeof courseSubCategories
											]
												? [
														...courseSubCategories[
															selectedCategory as keyof typeof courseSubCategories
														],
													]
												: [];
										console.log(
											"Sub-category options being passed:",
											subCategories,
										);
										return subCategories;
									})()}
									initialValue={course?.subCategory}
								/>

								<CustomFormField
									name="coursePrice"
									label="Course Price"
									type="number"
									placeholder="0"
									initialValue={course?.price}
								/>

								{/* What You'll Learn Section */}
								<DynamicArrayInput
									name="whatYoullLearn"
									label="What You'll Learn"
									placeholder="e.g., Master React fundamentals, Build responsive UIs, Deploy to production"
									minItems={1}
									maxItems={20}
									description="List the key skills and knowledge students will gain from this course"
								/>

								{/* Requirements Section */}
								<DynamicArrayInput
									name="requirements"
									label="Course Requirements"
									placeholder="e.g., Basic HTML knowledge, Node.js installed, Git experience"
									minItems={1}
									maxItems={15}
									description="Specify what students need to know or have before taking this course"
								/>

								{/* Cover Photo Upload Section */}
								<div className="space-y-3">
									<label className="text-sm font-medium text-customgreys-dirtyGrey">
										Course Cover Photo
									</label>
									<div className="border border-customgreys-dirtyGrey rounded-lg p-4">
										{/* Cover Photo Preview */}
										<div className="mb-4">
											<div className="relative w-full h-48 bg-customgreys-darkGrey rounded-lg overflow-hidden">
												{coverPhotoPreview ? (
													<img
														src={coverPhotoPreview}
														alt="Course cover preview"
														className="w-full h-full object-cover"
													/>
												) : course?.image &&
												  course.image !== "/placeholder.png" ? (
													<img
														src={course.image}
														alt="Course cover"
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center text-customgreys-dirtyGrey">
														<div className="text-center">
															<Upload className="w-8 h-8 mx-auto mb-2" />
															<p className="text-sm">No cover photo uploaded</p>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* Upload Controls */}
										<div className="flex gap-2">
											<label className="flex-1">
												<input
													type="file"
													accept="image/*"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															handleCoverPhotoUpload(file);
														}
													}}
													className="hidden"
												/>
												<div className="w-full px-4 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded-lg cursor-pointer text-center text-sm font-medium transition-colors">
													<Upload className="w-4 h-4 inline mr-2" />
													{localCoverPhoto ||
													(course?.image && course.image !== "/placeholder.png")
														? "Update Cover Photo"
														: "Upload Cover Photo"}
												</div>
											</label>
										</div>

										{/* Upload Info */}
										<p className="text-xs text-customgreys-dirtyGrey mt-2">
											Recommended: 1280x720px, JPG/PNG format, max 5MB
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
							<div className="flex justify-between items-center mb-2">
								<h2 className="text-2xl font-semibold text-secondary-foreground">
									Sections
								</h2>

								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										dispatch(openSectionModal({ sectionIndex: null }))
									}
									className="border-none text-primary-700 group"
								>
									<Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
									<span className="text-primary-700 group-hover:white-100">
										Add Section
									</span>
								</Button>
							</div>

							{isLoading ? (
								<p>Loading course content...</p>
							) : sections.length > 0 ? (
								<DroppableComponent />
							) : (
								<p>No sections available</p>
							)}
						</div>
					</div>
				</form>
			</Form>

			<ChapterModal />
			<SectionModal />
		</div>
	);
};

export default CourseEditor;
