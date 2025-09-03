"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type DescriptionProps = {
	course: Course;
};

const Description: React.FC<DescriptionProps> = ({ course }) => {
	const [isExpanded, setIsExpanded] = useState(false);

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
						<div>
							<div className="mt-3 sm:mt-4">
								<p className="font-medium text-sm sm:text-base">
									What you'll learn
								</p>
								<ul className="mt-2 space-y-1">
									<li className="text-xs sm:text-sm">
										• Build advanced Generative AI products using cutting-edge
										models and frameworks.
									</li>
									<li className="text-xs sm:text-sm">
										• Master RAG (Retrieval-Augmented Generation) for enhanced
										AI applications.
									</li>
									<li className="text-xs sm:text-sm">
										• Implement fine-tuning techniques with LoRA and QLoRA for
										optimal performance.
									</li>
									<li className="text-xs sm:text-sm">
										• Develop multi-agent systems for complex problem-solving.
									</li>
									<li className="text-xs sm:text-sm">
										• Create AI-powered applications with real-world business
										value.
									</li>
								</ul>
							</div>
						</div>
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
