"use client";

import React, { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ReviewsProps = {
	course: Course;
};

const Reviews: React.FC<ReviewsProps> = ({ course }) => {
	const [showAllReviews, setShowAllReviews] = useState(false);

	const reviews = [
		{
			id: 1,
			name: "ARGHADEEP D.",
			initials: "AD",
			rating: 5,
			date: "2 days ago",
			text: "This is a life changing course so far. Meticulously described each chapter with hands-on. Looking forward to your Agentic AI course...",
			helpful: 12,
		},
		{
			id: 2,
			name: "Daniel R.",
			initials: "DR",
			rating: 5,
			date: "a week ago",
			text: "Excellent course! Ed explained each concept clearly and at a great pace. The projects were practical and diverse. The RAG-based knowledge worker and fine-tuning a LLaMA model using QLORA for price prediction was particularly impressive. The hands-on approach made complex concepts accessible. Highly recommended for anyone serious about LLM engineering.",
			helpful: 8,
		},
		{
			id: 3,
			name: "Bernd K.",
			initials: "BK",
			rating: 5,
			date: "2 weeks ago",
			text: "Einer der besten Kurse, die ich bisher gemacht habe. Ed Donner ist ein hervorragender Trainer, der den Stoff gut vermittelt, dabei sehr motivierend ist und auch Spaß vermittelt. Absolut Spitze!",
			helpful: 15,
		},
		{
			id: 4,
			name: "Mark H.",
			initials: "MH",
			rating: 5,
			date: "2 weeks ago",
			text: "I don't think I've seen a better course on all of Udemy. And I've taken a bunch in the coding/data science area. I'm even currently taking a University-sponsored class on LLM development for > $2000 fee. Ed's LLM course is more comprehensive, practical, and better structured than the university course. The projects are real-world applicable and the explanations are crystal clear.",
			helpful: 23,
		},
	];

	const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
				<div className="flex items-center gap-2">
					<Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
					<span className="text-lg sm:text-xl font-semibold text-white-50">
						4.7 course rating
					</span>
				</div>
				<span className="hidden sm:inline text-customgreys-dirtyGrey">•</span>
				<span className="text-customgreys-dirtyGrey text-sm sm:text-base">
					17K ratings
				</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
				{displayedReviews.map((review) => (
					<div key={review.id} className="space-y-2 sm:space-y-3">
						<div className="flex items-start gap-2 sm:gap-3">
							<Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
								<AvatarFallback className="bg-primary-700 text-white-50 text-xs sm:text-sm font-medium">
									{review.initials}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
								<div className="flex items-start sm:items-center justify-between gap-2">
									<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
										<span className="font-medium text-white-50 text-sm sm:text-base truncate">
											{review.name}
										</span>
										<div className="flex items-center">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-customgreys-dirtyGrey"}`}
												/>
											))}
										</div>
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="h-5 w-5 sm:h-6 sm:w-6 p-0 flex-shrink-0"
									>
										<MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
									</Button>
								</div>

								<p className="text-xs sm:text-sm text-customgreys-dirtyGrey">
									{review.date}
								</p>

								<p className="text-xs sm:text-sm text-customgreys-dirtyGrey leading-relaxed">
									{review.text.length > 200 && !showAllReviews ? (
										<>
											{review.text.substring(0, 200)}...
											<Button
												variant="ghost"
												className="text-primary-600 hover:text-primary-500 p-0 h-auto ml-1 text-xs sm:text-sm"
												onClick={() => setShowAllReviews(true)}
											>
												Show more
											</Button>
										</>
									) : (
										review.text
									)}
								</p>

								<div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-customgreys-dirtyGrey">
									<span>Helpful?</span>
									<div className="flex items-center gap-1 sm:gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="h-5 w-5 sm:h-6 sm:w-6 p-0"
										>
											<ThumbsUp className="w-2 h-2 sm:w-3 sm:h-3" />
										</Button>
										<span className="text-xs sm:text-sm">{review.helpful}</span>
										<Button
											variant="ghost"
											size="sm"
											className="h-5 w-5 sm:h-6 sm:w-6 p-0"
										>
											<ThumbsDown className="w-2 h-2 sm:w-3 sm:h-3" />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{!showAllReviews && (
				<Button
					className="bg-primary-700 hover:bg-primary-600 text-white-50 text-sm sm:text-base py-2 sm:py-3"
					onClick={() => setShowAllReviews(true)}
				>
					Show all reviews
				</Button>
			)}
		</div>
	);
};

export default Reviews;
