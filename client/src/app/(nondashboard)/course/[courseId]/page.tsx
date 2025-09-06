"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetCoursesQuery } from "@/state/api";
import Loading from "@/components/Loading";
import CourseHeroSection from "@/components/CourseHeroSection";
import StickyPricingCard from "@/components/StickyPricingCard";
import WhatYoullLearn from "@/components/WhatYoullLearn";
import CourseContent from "@/components/CourseContent";
import Requirements from "@/components/Requirements";
import Description from "@/components/Description";
import InstructorInfo from "@/components/InstructorInfo";
import Reviews from "@/components/Reviews";
import RelatedCourses from "@/components/RelatedCourses";

const CourseDetailPage = () => {
	const params = useParams();
	const router = useRouter();
	const courseId = params.courseId as string;
	const {
		data: courses,
		isLoading,
		isError,
	} = useGetCoursesQuery({ category: "all", teacherId: "" });
	const [courseData, setCourseData] = useState<Course | null>(null);

	useEffect(() => {
		if (courses && courseId) {
			const course = courses.find((c) => c.courseId === courseId);
			setCourseData(course || null);
		}
	}, [courses, courseId]);

	if (isLoading) return <Loading />;
	if (isError || !courses) return <div>Failed to fetch courses</div>;
	if (!courseData) return <div>Course not found</div>;

	const handleEnrollNow = (courseId: string) => {
		router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`);
	};

	return (
		<div className="min-h-screen bg-customgreys-primarybg w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto">
			{/* Breadcrumb */}
			<div className="bg-customgreys-secondarybg border-b border-customgreys-darkerGrey">
				<div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
					<nav className="text-xs sm:text-sm">
						<span className="text-customgreys-dirtyGrey">
							{courseData.category}
						</span>
						<span className="mx-1 sm:mx-2 text-customgreys-dirtyGrey">
							&gt;
						</span>
						<span className="text-customgreys-dirtyGrey">
							{courseData.subCategory}
						</span>
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
				<div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-12">
					{/* Left Column - Main Content */}
					<div className="flex-1 min-w-0">
						<CourseHeroSection course={courseData} />
						<div className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
							<WhatYoullLearn course={courseData} />
							<CourseContent course={courseData} />
							<Requirements course={courseData} />
							<Description course={courseData} />
							<InstructorInfo course={courseData} />
							<Reviews course={courseData} />
							<RelatedCourses currentCourseId={courseId} />
						</div>
					</div>

					{/* Right Column - Sticky Pricing Card */}
					<div className="xl:w-96 xl:flex-shrink-0 order-first xl:order-last">
						<StickyPricingCard
							course={courseData}
							onEnrollNow={handleEnrollNow}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseDetailPage;
