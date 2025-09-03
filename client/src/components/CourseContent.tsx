"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type CourseContentProps = {
	course: Course;
};

const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
	const [expandedSections, setExpandedSections] = useState<Set<number>>(
		new Set([0]),
	);
	const [allExpanded, setAllExpanded] = useState(false);

	const toggleSection = (index: number) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(index)) {
			newExpanded.delete(index);
		} else {
			newExpanded.add(index);
		}
		setExpandedSections(newExpanded);
	};

	const toggleAllSections = () => {
		if (allExpanded) {
			setExpandedSections(new Set());
		} else {
			setExpandedSections(new Set(course.sections.map((_, index) => index)));
		}
		setAllExpanded(!allExpanded);
	};

	const totalLectures = course.sections.reduce(
		(sum, section) => sum + section.chapters.length,
		0,
	);

	// Calculate total duration (assuming 10 minutes per chapter as placeholder)
	const totalMinutes = totalLectures * 10;
	const totalHours = Math.floor(totalMinutes / 60);
	const totalMinutesRemainder = totalMinutes % 60;
	const totalDuration = `${totalHours}h ${totalMinutesRemainder}m`;

	return (
		<div className="space-y-3 sm:space-y-4">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
				<h2 className="text-xl sm:text-2xl font-bold text-white-50">
					Course content
				</h2>
				<Button
					variant="ghost"
					className="text-primary-600 hover:text-primary-500 p-0 h-auto text-xs sm:text-sm self-start sm:self-auto"
					onClick={toggleAllSections}
				>
					{allExpanded ? "Collapse all sections" : "Expand all sections"}
				</Button>
			</div>

			<div className="text-xs sm:text-sm text-customgreys-dirtyGrey">
				{course.sections.length} sections • {totalLectures} lectures •{" "}
				{totalDuration} total length
			</div>

			<div className="border border-customgreys-darkerGrey rounded-lg overflow-hidden bg-customgreys-secondarybg">
				{course.sections.map((section, index) => (
					<div
						key={section.sectionId}
						className="border-b border-customgreys-darkerGrey last:border-b-0"
					>
						<button
							onClick={() => toggleSection(index)}
							className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-primary-700/10 focus:outline-none focus:bg-primary-700/10 transition-colors duration-200"
						>
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
									{expandedSections.has(index) ? (
										<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
									) : (
										<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
									)}
									<div className="min-w-0 flex-1">
										<h3 className="font-medium text-white-50 text-sm sm:text-base truncate">
											{section.sectionTitle}
										</h3>
									</div>
								</div>
								<div className="text-xs sm:text-sm text-primary-500 font-medium flex-shrink-0">
									<span className="hidden sm:inline">
										{section.chapters.length} lectures •{" "}
									</span>
									<span className="sm:hidden">
										{section.chapters.length} •{" "}
									</span>
									{Math.floor((section.chapters.length * 10) / 60)}h{" "}
									{(section.chapters.length * 10) % 60}m
								</div>
							</div>
						</button>

						{expandedSections.has(index) && (
							<div className="px-3 sm:px-4 pb-2 sm:pb-3 bg-customgreys-darkerGrey border-l-4 border-primary-600">
								<div className="space-y-1 sm:space-y-2">
									{section.chapters.map((chapter, chapterIndex) => (
										<div
											key={chapter.chapterId}
											className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm hover:bg-primary-700/5 rounded-md px-1 sm:px-2 py-1 transition-colors duration-150"
										>
											<Play className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
											<span className="text-white-50 truncate flex-1 min-w-0">
												{chapter.title}
											</span>
											<div className="ml-auto flex items-center gap-1 text-primary-500 flex-shrink-0">
												<Clock className="w-2 h-2 sm:w-3 sm:h-3" />
												<span className="font-medium text-xs sm:text-sm">
													10 min
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default CourseContent;
