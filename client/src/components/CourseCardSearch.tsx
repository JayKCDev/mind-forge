"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const CourseCardSearch: React.FC<SearchCourseCardProps> = ({
	course,
	isSelected,
	onClick,
}) => {
	const router = useRouter();

	const handleCardClick = () => {
		if (onClick) {
			onClick();
		} else {
			router.push(`/course/${course.courseId}`);
		}
	};

	return (
		<div
			onClick={handleCardClick}
			className={`course-card-search group cursor-pointer ${
				isSelected
					? "course-card-search--selected"
					: "course-card-search--unselected"
			}`}
		>
			{/* Course Image */}
			<div className="course-card-search__image-container">
				<Image
					src={course.image || "/placeholder.png"}
					alt={`Course thumbnail for ${course.title}`}
					fill
					className="course-card-search__image"
					priority
				/>
				{course.status === "Draft" && (
					<Badge
						variant="secondary"
						className="absolute top-2 right-2 bg-yellow-600 text-white"
					>
						Draft
					</Badge>
				)}
			</div>

			{/* Course Content */}
			<div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
				<h3 className="text-base sm:text-lg font-semibold text-white-50 line-clamp-2">
					{course.title}
				</h3>

				{course.description && (
					<p className="text-customgreys-dirtyGrey text-xs sm:text-sm line-clamp-2">
						{course.description}
					</p>
				)}

				<div className="flex items-center gap-2">
					<div className="w-5 h-5 sm:w-6 sm:h-6 bg-customgreys-secondarybg rounded-full flex items-center justify-center">
						<span className="text-xs text-white-50 font-medium">
							{course.teacherName?.[0] || "T"}
						</span>
					</div>
					<p className="text-xs sm:text-sm text-customgreys-dirtyGrey font-medium">
						{course.teacherName}
					</p>
				</div>

				<div className="flex items-center justify-between">
					<Badge variant="outline" className="text-xs">
						{course.category}
					</Badge>
					{course.price && (
						<span className="text-base sm:text-lg font-bold text-primary-600">
							{formatPrice(course.price)}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default CourseCardSearch;
