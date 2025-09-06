"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type DescriptionProps = {
	course: Course;
};

const Description: React.FC<DescriptionProps> = ({ course }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	// Don't render if no description available
	if (!course.description || course.description.trim() === "") {
		return null;
	}

	return (
		<div className="space-y-3 sm:space-y-4">
			<h2 className="text-xl sm:text-2xl font-bold text-white-50">
				Description
			</h2>
			<div className="space-y-3 sm:space-y-4">
				<div className="text-customgreys-dirtyGrey text-xs sm:text-sm leading-relaxed">
					{isExpanded ? (
						<div className="whitespace-pre-line">{course.description}</div>
					) : (
						<div className="line-clamp-3">{course.description}</div>
					)}
				</div>
				<Button
					variant="ghost"
					className="text-primary-600 hover:text-primary-500 p-0 h-auto flex items-center gap-1 text-xs sm:text-sm"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					{isExpanded ? "Show less" : "Show more"}
					<ChevronDown
						className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
					/>
				</Button>
			</div>
		</div>
	);
};

export default Description;
