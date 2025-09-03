"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Star, Clock, Play } from "lucide-react";

interface CourseCardSearchProps {
	course: Course;
	view?: "grid" | "list";
	onClick?: () => void;
}

const CourseCardSearch: React.FC<CourseCardSearchProps> = ({
	course,
	view = "list",
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

	const renderStars = (rating: number) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />,
			);
		}

		if (hasHalfStar) {
			stars.push(
				<Star
					key="half"
					className="h-3 w-3 fill-yellow-400/50 text-yellow-400"
				/>,
			);
		}

		const remainingStars = 5 - Math.ceil(rating);
		for (let i = 0; i < remainingStars; i++) {
			stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
		}

		return stars;
	};

	const getBadgeVariant = (badge: string) => {
		switch (badge) {
			case "Premium":
				return "default";
			case "Bestseller":
				return "secondary";
			case "New":
				return "outline";
			case "Hot":
				return "destructive";
			default:
				return "outline";
		}
	};

	if (view === "grid") {
		// Grid view (2 cards per row)
		return (
			<div
				onClick={handleCardClick}
				className="bg-customgreys-secondarybg border border-customgreys-secondarybg rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
			>
				{/* Course Image */}
				<div className="relative w-full h-48">
					<Image
						src={course.image || "/placeholder.png"}
						alt={`Course thumbnail for ${course.title}`}
						fill
						className="object-cover"
						priority
					/>
					{course.badges && course.badges.length > 0 && (
						<div className="absolute top-2 left-2 flex gap-1">
							{course.badges.slice(0, 2).map((badge, index) => (
								<Badge
									key={index}
									variant={getBadgeVariant(badge)}
									className="text-xs"
								>
									{badge}
								</Badge>
							))}
						</div>
					)}
				</div>

				{/* Course Content */}
				<div className="p-4 flex-1 flex flex-col">
					<h3 className="text-sm font-semibold text-white-50 line-clamp-2 mb-2">
						{course.title}
					</h3>

					<p className="text-xs text-customgreys-dirtyGrey line-clamp-2 mb-2 flex-1">
						{course.description}
					</p>

					<div className="text-xs text-customgreys-dirtyGrey mb-2">
						{course.teacherName}
					</div>

					{/* Rating and Reviews */}
					{course.rating && (
						<div className="flex items-center gap-1 mb-2">
							<div className="flex items-center">
								{renderStars(course.rating)}
							</div>
							<span className="text-xs text-white-50">
								{course.rating.toFixed(1)}
							</span>
							{course.reviewCount && (
								<span className="text-xs text-customgreys-dirtyGrey">
									({course.reviewCount.toLocaleString()})
								</span>
							)}
						</div>
					)}

					{/* Course Details */}
					<div className="flex items-center gap-2 text-xs text-customgreys-dirtyGrey mb-3">
						{course.duration && (
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								<span>{course.duration}h</span>
							</div>
						)}
						{course.lectureCount && (
							<div className="flex items-center gap-1">
								<Play className="h-3 w-3" />
								<span>{course.lectureCount} lectures</span>
							</div>
						)}
					</div>

					{/* Price */}
					<div className="flex items-center justify-between">
						<Badge
							variant="outline"
							className="text-xs border-customgreys-darkerGrey text-customgreys-dirtyGrey"
						>
							{course.level}
						</Badge>
						{course.price && (
							<span className="text-lg font-bold text-primary-600">
								{formatPrice(course.price)}
							</span>
						)}
					</div>
				</div>
			</div>
		);
	}

	// List view (1 card per row) - Udemy style
	return (
		<div
			onClick={handleCardClick}
			className="bg-customgreys-secondarybg border border-customgreys-secondarybg rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
		>
			<div className="flex">
				{/* Course Image */}
				<div className="relative w-48 h-32 flex-shrink-0">
					<Image
						src={course.image || "/placeholder.png"}
						alt={`Course thumbnail for ${course.title}`}
						fill
						className="object-cover"
						priority
					/>
					{course.badges && course.badges.length > 0 && (
						<div className="absolute top-2 left-2 flex gap-1">
							{course.badges.slice(0, 2).map((badge, index) => (
								<Badge
									key={index}
									variant={getBadgeVariant(badge)}
									className="text-xs"
								>
									{badge}
								</Badge>
							))}
						</div>
					)}
				</div>

				{/* Course Content */}
				<div className="flex-1 p-4">
					<div className="flex justify-between items-start mb-2">
						<h3 className="text-lg font-semibold text-white-50 line-clamp-2 flex-1 mr-4">
							{course.title}
						</h3>
						{course.price && (
							<span className="text-xl font-bold text-primary-600 flex-shrink-0">
								{formatPrice(course.price)}
							</span>
						)}
					</div>

					<p className="text-sm text-customgreys-dirtyGrey line-clamp-2 mb-2">
						{course.description}
					</p>

					<div className="text-sm text-customgreys-dirtyGrey mb-2">
						{course.teacherName}
					</div>

					{/* Rating and Reviews */}
					{course.rating && (
						<div className="flex items-center gap-1 mb-2">
							<div className="flex items-center">
								{renderStars(course.rating)}
							</div>
							<span className="text-sm text-white-50">
								{course.rating.toFixed(1)}
							</span>
							{course.reviewCount && (
								<span className="text-sm text-customgreys-dirtyGrey">
									({course.reviewCount.toLocaleString()} reviews)
								</span>
							)}
						</div>
					)}

					{/* Course Details */}
					<div className="flex items-center gap-4 text-sm text-customgreys-dirtyGrey">
						{course.duration && (
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								<span>{course.duration} total hours</span>
							</div>
						)}
						{course.lectureCount && (
							<div className="flex items-center gap-1">
								<Play className="h-4 w-4" />
								<span>{course.lectureCount} lectures</span>
							</div>
						)}
						<Badge
							variant="outline"
							className="text-xs border-customgreys-darkerGrey text-customgreys-dirtyGrey"
						>
							{course.level}
						</Badge>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseCardSearch;
