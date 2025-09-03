"use client";

import React from "react";
import Image from "next/image";
import { Heart, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCoursesQuery } from "@/state/api";

type RelatedCoursesProps = {
	currentCourseId: string;
};

const RelatedCourses: React.FC<RelatedCoursesProps> = ({ currentCourseId }) => {
	const { data: courses } = useGetCoursesQuery({
		category: undefined,
		teacherId: "",
	});

	// Filter out current course and get related courses
	const relatedCourses =
		courses
			?.filter((course) => course.courseId !== currentCourseId)
			.slice(0, 6) || [];

	const formatPrice = (price?: number) => {
		if (!price) return "Free";
		return `$${(price / 100).toLocaleString()}`;
	};

	const getTotalDuration = (sections: any[]) => {
		const totalLectures = sections.reduce(
			(sum, section) => sum + section.chapters.length,
			0,
		);
		const totalMinutes = totalLectures * 10; // Assuming 10 minutes per lecture
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours}h ${minutes}m`;
	};

	if (relatedCourses.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<h2 className="text-xl sm:text-2xl font-bold text-white-50">
				Students also bought
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{relatedCourses.map((course) => (
					<div
						key={course.courseId}
						className="border border-customgreys-darkerGrey rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-customgreys-secondarybg"
					>
						<div className="relative aspect-video">
							{course.image ? (
								<Image
									src={course.image}
									alt={course.title}
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-700"></div>
							)}
							<Button
								variant="ghost"
								size="sm"
								className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/80 hover:bg-white"
							>
								<Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
							</Button>
						</div>

						<div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
							<div>
								<h3 className="font-semibold text-white-50 line-clamp-2 leading-tight text-sm sm:text-base">
									{course.title}
								</h3>
								<p className="text-xs sm:text-sm text-customgreys-dirtyGrey mt-1">
									{course.teacherName}
								</p>
							</div>

							<div className="flex items-center gap-2 text-xs sm:text-sm">
								<div className="flex items-center gap-1">
									<Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
									<span className="font-medium">4.7</span>
								</div>
								<span className="text-customgreys-dirtyGrey">
									({course.enrollments?.length || 0})
								</span>
							</div>

							<div className="flex items-center gap-2 text-xs sm:text-sm text-customgreys-dirtyGrey">
								<Clock className="w-3 h-3 sm:w-4 sm:h-4" />
								<span>{getTotalDuration(course.sections)}</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex gap-1 sm:gap-2">
									<Badge
										className={`text-xs ${
											course.level === "Advanced"
												? "bg-primary-700 text-white-50"
												: "bg-primary-600 text-white-50"
										}`}
									>
										{course.level}
									</Badge>
								</div>
								<span className="font-semibold text-white-50 text-sm sm:text-base">
									{formatPrice(course.price)}
								</span>
							</div>

							<div className="text-xs text-customgreys-dirtyGrey">
								{course.category}
							</div>
						</div>
					</div>
				))}
			</div>

			<Button
				variant="outline"
				className="w-full border-customgreys-darkerGrey text-customgreys-dirtyGrey hover:bg-customgreys-darkerGrey text-sm sm:text-base py-2 sm:py-3"
			>
				Show more
			</Button>
		</div>
	);
};

export default RelatedCourses;
