"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, Share2, Tag, Play } from "lucide-react";

type StickyPricingCardProps = {
	course: Course;
	onEnrollNow: (courseId: string) => void;
};

const StickyPricingCard: React.FC<StickyPricingCardProps> = ({
	course,
	onEnrollNow,
}) => {
	const [couponCode, setCouponCode] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState("LETSLEARNNOW");

	const formatPrice = (price?: number) => {
		if (!price) return "Free";
		return `$${(price / 100).toLocaleString()}`;
	};

	const handleApplyCoupon = () => {
		if (couponCode.trim()) {
			setAppliedCoupon(couponCode.trim());
			setCouponCode("");
		}
	};

	const handleAddToCart = () => {
		// Add to cart logic
		console.log("Added to cart:", course.courseId);
	};

	const handleBuyNow = () => {
		onEnrollNow(course.courseId);
	};

	return (
		<div className="sticky top-4 bg-customgreys-secondarybg border border-customgreys-darkerGrey rounded-lg shadow-lg overflow-hidden">
			{/* Course Image */}
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
				<div className="absolute inset-0 flex items-center justify-center">
					<Button
						size="lg"
						className="bg-black/80 hover:bg-black/90 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 p-0"
					>
						<Play className="w-4 h-4 sm:w-6 sm:h-6 ml-1" />
					</Button>
				</div>
				<div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/80 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm">
					Preview this course
				</div>
			</div>

			{/* Premium Course Banner */}
			<div className="bg-primary-700/20 border-b border-customgreys-darkerGrey px-3 sm:px-4 py-2 sm:py-3">
				<div className="flex items-center gap-2">
					<Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
					<span className="text-xs sm:text-sm font-medium text-primary-600">
						This Premium course is included in plans
					</span>
				</div>
			</div>

			<div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
				{/* Subscription Section */}
				<div className="space-y-2 sm:space-y-3">
					<h3 className="font-semibold text-white-50 text-sm sm:text-base">
						Subscribe to Mind Forge&apos;s top courses
					</h3>
					<p className="text-xs sm:text-sm text-customgreys-dirtyGrey">
						Get this course, plus 26,000+ of our top-rated courses, with
						Personal Plan.{" "}
						<span className="text-primary-600 underline cursor-pointer">
							Learn more
						</span>
					</p>
					<Button
						className="w-full bg-primary-700 hover:bg-primary-600 text-white-50 text-sm sm:text-base py-2 sm:py-3"
						onClick={handleBuyNow}
					>
						Start subscription
					</Button>
					<div className="text-center">
						<span className="text-sm sm:text-lg font-semibold text-white-50">
							Starting at{" "}
						</span>
						<span className="text-sm sm:text-lg font-semibold text-customgreys-dirtyGrey line-through">
							$50
						</span>
						<span className="text-sm sm:text-lg font-semibold text-white-50">
							{" "}
							$37.50
						</span>
						<span className="text-xs sm:text-sm text-customgreys-dirtyGrey">
							{" "}
							per month
						</span>
					</div>
					<p className="text-xs text-customgreys-dirtyGrey text-center">
						Cancel anytime
					</p>
				</div>

				{/* Separator */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-customgreys-darkerGrey"></div>
					</div>
					<div className="relative flex justify-center text-xs sm:text-sm">
						<span className="px-2 bg-customgreys-secondarybg text-customgreys-dirtyGrey">
							or
						</span>
					</div>
				</div>

				{/* Individual Course Purchase */}
				<div className="space-y-2 sm:space-y-3">
					<div className="text-center">
						<span className="text-2xl sm:text-3xl font-bold text-white-50">
							{formatPrice(course.price)}
						</span>
					</div>

					<div className="space-y-2">
						<Button
							className="w-full bg-primary-700 hover:bg-primary-600 text-white-50 text-sm sm:text-base py-2 sm:py-3"
							onClick={handleAddToCart}
						>
							Add to cart
						</Button>
						<Button
							variant="outline"
							className="w-full border-primary-600 text-primary-600 hover:bg-primary-700/20 text-sm sm:text-base py-2 sm:py-3"
							onClick={handleBuyNow}
						>
							Buy now
						</Button>
					</div>

					{/* Guarantees */}
					<div className="text-center space-y-1">
						<p className="text-xs sm:text-sm text-customgreys-dirtyGrey">
							30-Day Money-Back Guarantee
						</p>
						<p className="text-xs sm:text-sm text-customgreys-dirtyGrey">
							Full Lifetime Access
						</p>
					</div>
				</div>

				{/* Action Links */}
				<div className="flex justify-center space-x-2 sm:space-x-4 pt-2 border-t border-customgreys-darkerGrey">
					<button className="text-xs sm:text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1">
						<Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
						<span className="hidden sm:inline">Share</span>
					</button>
					<button className="text-xs sm:text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1">
						<Gift className="w-3 h-3 sm:w-4 sm:h-4" />
						<span className="hidden sm:inline">Gift this course</span>
					</button>
					<button className="text-xs sm:text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1">
						<Tag className="w-3 h-3 sm:w-4 sm:h-4" />
						<span className="hidden sm:inline">Apply Coupon</span>
					</button>
				</div>

				{/* Coupon Section */}
				{appliedCoupon && (
					<div className="bg-customgreys-primarybg rounded-lg p-2 sm:p-3 space-y-2">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs sm:text-sm font-medium text-white-50">
									{appliedCoupon} is applied
								</p>
								<p className="text-xs text-customgreys-dirtyGrey">
									Mind Forge coupon
								</p>
							</div>
							<Badge variant="secondary" className="text-xs">
								Applied
							</Badge>
						</div>
					</div>
				)}

				{/* Coupon Input */}
				<div className="space-y-2">
					<Input
						placeholder="Enter Coupon"
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value)}
						className="text-xs sm:text-sm bg-customgreys-primarybg border-customgreys-darkerGrey text-white-50 placeholder-customgreys-dirtyGrey"
					/>
					<Button
						variant="outline"
						size="sm"
						className="w-full border-primary-600 text-primary-600 hover:bg-primary-700/20 text-xs sm:text-sm"
						onClick={handleApplyCoupon}
					>
						Apply
					</Button>
				</div>
			</div>
		</div>
	);
};

export default StickyPricingCard;
