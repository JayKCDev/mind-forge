"use client";

import React from "react";
import { Check } from "lucide-react";

type WhatYoullLearnProps = {
	course: Course;
};

const WhatYoullLearn: React.FC<WhatYoullLearnProps> = ({ course }) => {
	// Don't render if no learning objectives available
	if (!course.whatYoullLearn || course.whatYoullLearn.length === 0) {
		return null;
	}

	return (
		<div className="space-y-3 sm:space-y-4">
			<h2 className="text-xl sm:text-2xl font-bold text-white-50">
				What you&apos;ll learn
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
				{course.whatYoullLearn.map((objective, index) => (
					<div key={index} className="flex items-start gap-2 sm:gap-3">
						<Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
						<span className="text-xs sm:text-sm text-customgreys-dirtyGrey leading-relaxed">
							{objective}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default WhatYoullLearn;
