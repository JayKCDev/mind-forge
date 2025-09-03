"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Globe, Award, Users } from "lucide-react";

type CourseHeroSectionProps = {
	course: Course;
};

const CourseHeroSection: React.FC<CourseHeroSectionProps> = ({ course }) => {
	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Course Title and Subtitle */}
			<div>
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white-50 leading-tight">
					{course.title}
				</h1>
				<p className="text-base sm:text-lg text-customgreys-dirtyGrey mt-2 leading-relaxed">
					{course.shortDescription ||
						"Master the fundamentals and advanced concepts in this comprehensive course."}
				</p>
			</div>

			{/* Bestseller Badge */}
			<Badge className="bg-primary-700 text-white-50 hover:bg-primary-600 px-3 py-1 text-xs sm:text-sm font-medium">
				Bestseller
			</Badge>

			{/* Course Meta Information */}
			<div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-customgreys-dirtyGrey">
				<span>
					Created by{" "}
					<span className="text-primary-600 font-medium">
						{course.teacherName}
					</span>
				</span>
				<span className="hidden sm:inline">•</span>
				<span>
					Last updated{" "}
					{new Date().toLocaleDateString("en-US", {
						month: "numeric",
						year: "numeric",
					})}
				</span>
				<span className="hidden sm:inline">•</span>
				<div className="flex items-center gap-1">
					<Globe className="w-3 h-3 sm:w-4 sm:h-4" />
					<span>English</span>
				</div>
				<span className="hidden sm:inline">•</span>
				<span className="text-customgreys-dirtyGrey">{course.level} Level</span>
			</div>

			{/* Premium Card with Rating and Stats - Responsive Layout */}
			<div className="bg-customgreys-secondarybg rounded-lg overflow-hidden shadow-sm border border-customgreys-darkerGrey">
				{/* Mobile Layout */}
				<div className="block sm:hidden">
					<div className="p-4 space-y-4">
						{/* Premium Badge */}
						<div className="flex items-center gap-3">
							<div className="bg-primary-700 px-3 py-2 rounded-lg flex items-center gap-2">
								<Award className="w-5 h-5 text-white fill-current" />
								<span className="text-white font-bold text-sm">Premium</span>
							</div>
						</div>

						{/* Description */}
						<div>
							<p className="text-white-50 text-sm leading-tight">
								Access this top-rated course, plus 26,000+ more top-rated
								courses, with a Udemy plan.
							</p>
							<span className="text-primary-600 underline cursor-pointer text-sm font-medium block mt-2">
								See Plans & Pricing
							</span>
						</div>

						{/* Stats */}
						<div className="flex justify-between items-center pt-2 border-t border-customgreys-darkerGrey">
							<div className="text-center">
								<div className="text-xl font-bold text-white-50">4.7</div>
								<div className="flex justify-center mb-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-3 h-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-customgreys-dirtyGrey"}`}
										/>
									))}
								</div>
								<span className="text-xs text-customgreys-dirtyGrey underline cursor-pointer">
									{(course.enrollments?.length || 0).toLocaleString()} ratings
								</span>
							</div>

							<div className="text-center">
								<div className="w-6 h-6 bg-customgreys-darkerGrey rounded-full flex items-center justify-center mx-auto mb-1">
									<Users className="w-3 h-3 text-customgreys-dirtyGrey" />
								</div>
								<div className="text-xl font-bold text-white-50">
									{(course.enrollments?.length || 0).toLocaleString()}
								</div>
								<span className="text-xs text-customgreys-dirtyGrey">
									learners
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Desktop Layout */}
				<div className="hidden sm:grid grid-cols-[110px_minmax(0,280px)_220px] gap-0">
					{/* Premium Section - Fixed width */}
					<div className="bg-primary-700 px-4 py-6 flex items-center justify-center">
						<div className="text-center">
							<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
								<Award className="w-8 h-8 text-white fill-current" />
							</div>
							<span className="text-white font-bold text-sm">Premium</span>
						</div>
					</div>

					{/* Course Access Description - Constrained width */}
					<div className="px-5 py-6 flex items-center min-w-0">
						<div className="w-full max-w-full">
							<p className="text-white-50 text-sm leading-tight break-words overflow-hidden text-ellipsis line-clamp-2">
								Access this top-rated course, plus 26,000+ more top-rated
								courses, with a Udemy plan.
							</p>
							<span className="text-primary-600 underline cursor-pointer text-sm font-medium block mt-2">
								See Plans & Pricing
							</span>
						</div>
					</div>

					{/* Statistics Section - Fixed width with proper distribution */}
					<div className="px-4 py-6 border-l border-customgreys-darkerGrey">
						<div className="flex items-center justify-between h-full w-full">
							{/* Rating Section */}
							<div className="text-center flex-1">
								<div className="text-2xl font-bold text-white-50">4.7</div>
								<div className="flex justify-center mb-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-customgreys-dirtyGrey"}`}
										/>
									))}
								</div>
								<span className="text-sm text-customgreys-dirtyGrey underline cursor-pointer">
									{(course.enrollments?.length || 0).toLocaleString()} ratings
								</span>
							</div>

							{/* Vertical Separator */}
							<div className="w-px h-full bg-customgreys-darkerGrey mx-3"></div>

							{/* Learners Section */}
							<div className="text-center flex-1">
								<div className="w-8 h-8 bg-customgreys-darkerGrey rounded-full flex items-center justify-center mx-auto mb-2">
									<Users className="w-4 h-4 text-customgreys-dirtyGrey" />
								</div>
								<div className="text-2xl font-bold text-white-50">
									{(course.enrollments?.length || 0).toLocaleString()}
								</div>
								<span className="text-sm text-customgreys-dirtyGrey">
									learners
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseHeroSection;
