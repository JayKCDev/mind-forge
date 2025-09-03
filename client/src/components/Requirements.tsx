"use client";

import React from "react";

type RequirementsProps = {
	course: Course;
};

const Requirements: React.FC<RequirementsProps> = ({ course }) => {
	const requirements = [
		"Familiarity with Python. This course will not cover Python basics and is completed in Python.",
		"A PC with an internet connection is required. Either Mac (Linux) or Windows.",
		"We recommend that you allocate around $5 for API costs to work with frontier models. However, you can complete the course using open-source models if you prefer.",
	];

	return (
		<div className="space-y-3 sm:space-y-4">
			<h2 className="text-xl sm:text-2xl font-bold text-white-50">
				Requirements
			</h2>
			<ul className="space-y-2">
				{requirements.map((requirement, index) => (
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
