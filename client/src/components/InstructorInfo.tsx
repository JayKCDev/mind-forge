"use client";

import React, { useState } from "react";
import { Star, MessageCircle, Users, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type InstructorInfoProps = {
	course: Course;
};

const InstructorInfo: React.FC<InstructorInfoProps> = ({ course }) => {
	const [showMore, setShowMore] = useState(false);

	// Create instructor data from course information
	const instructor = {
		name: course.teacherName,
		title: "Course Instructor",
		avatar: "/api/placeholder/80/80",
		rating: 4.7,
		reviews: 1234,
		students: course.enrollments?.length || 0,
		courses: 1,
		bio: `Meet ${course.teacherName}, your instructor for this ${course.level.toLowerCase()} level course in ${course.category}.`,
		fullBio: `Meet ${course.teacherName}, your instructor for this ${course.level.toLowerCase()} level course in ${course.category}. This comprehensive course covers essential topics and provides hands-on experience to help you master the subject matter.`,
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<h2 className="text-xl sm:text-2xl font-bold text-white-50">
				Instructor
			</h2>

			<div className="space-y-3 sm:space-y-4">
				<div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
					<Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
						<AvatarImage src={instructor.avatar} alt={instructor.name} />
						<AvatarFallback className="bg-primary-700 text-white-50 text-base sm:text-lg font-semibold">
							{instructor.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>

					<div className="flex-1 space-y-2 min-w-0">
						<div>
							<h3 className="text-base sm:text-lg font-semibold text-white-50 hover:text-primary-600 cursor-pointer">
								{instructor.name}
							</h3>
							<p className="text-xs sm:text-sm text-customgreys-dirtyGrey">
								{instructor.title}
							</p>
						</div>

						{/* Stats */}
						<div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
							<div className="flex items-center gap-1">
								<Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
								<span className="font-medium">
									{instructor.rating} Instructor Rating
								</span>
							</div>
							<div className="flex items-center gap-1">
								<MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-customgreys-dirtyGrey" />
								<span className="text-customgreys-dirtyGrey">
									{instructor.reviews.toLocaleString()} Reviews
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Users className="w-3 h-3 sm:w-4 sm:h-4 text-customgreys-dirtyGrey" />
								<span className="text-customgreys-dirtyGrey">
									{instructor.students.toLocaleString()} Students
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Play className="w-3 h-3 sm:w-4 sm:h-4 text-customgreys-dirtyGrey" />
								<span className="text-customgreys-dirtyGrey">
									{instructor.courses} Course
								</span>
							</div>
						</div>

						{/* Bio */}
						<div className="text-xs sm:text-sm text-customgreys-dirtyGrey leading-relaxed">
							{showMore ? instructor.fullBio : instructor.bio}
							{!showMore &&
								instructor.bio.length < instructor.fullBio.length && (
									<Button
										variant="ghost"
										className="text-primary-600 hover:text-primary-500 p-0 h-auto ml-1 text-xs sm:text-sm"
										onClick={() => setShowMore(true)}
									>
										Show more
									</Button>
								)}
							{showMore && (
								<Button
									variant="ghost"
									className="text-primary-600 hover:text-primary-500 p-0 h-auto ml-1 text-xs sm:text-sm"
									onClick={() => setShowMore(false)}
								>
									Show less
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InstructorInfo;
