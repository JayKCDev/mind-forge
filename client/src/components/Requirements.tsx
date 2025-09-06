"use client";

import React from "react";

type RequirementsProps = {
	course: Course;
};

const Requirements: React.FC<RequirementsProps> = ({ course }) => {
	// Don't render if no requirements available
	if (!course.requirements || course.requirements.length === 0) {
		return null;
	}

	return (
		<div className="space-y-3 sm:space-y-4">
			<h2 className="text-xl sm:text-2xl font-bold text-white-50">
				Requirements
			</h2>
			<ul className="space-y-2">
				{course.requirements.map((requirement, index) => (
					<li key={index} className="flex items-start gap-2 sm:gap-3">
						<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></span>
						<span className="text-customgreys-dirtyGrey text-xs sm:text-sm leading-relaxed">
							{requirement}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Requirements;
