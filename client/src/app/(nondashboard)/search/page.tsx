"use client";

import Loading from "@/components/Loading";
import { useGetCoursesQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import CourseCardSearch from "@/components/CourseCardSearch";
import CourseFilters from "@/components/CourseFilters";
import CourseSortDropdown from "@/components/CourseSortDropdown";
import CourseViewToggle from "@/components/CourseViewToggle";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/state/redux";
import { clearFilters } from "@/state/searchSlice";

const Search = () => {
	const {
		data: courses,
		isLoading,
		isError,
	} = useGetCoursesQuery({ category: undefined, teacherId: "" });
	const router = useRouter();
	const dispatch = useAppDispatch();

	// Redux state
	const { filters, sortBy, view } = useAppSelector((state) => state.search);

	// Filter and sort courses
	const filteredAndSortedCourses = useMemo(() => {
		if (!courses) return [];

		let filtered = [...courses];

		// Apply rating filter
		if (filters.ratings) {
			const minRating = parseFloat(filters.ratings);
			filtered = filtered.filter(
				(course) => course.rating && course.rating >= minRating,
			);
		}

		// Apply level filter
		if (filters.level.length > 0) {
			filtered = filtered.filter((course) =>
				filters.level.includes(course.level),
			);
		}

		// Apply price filter
		if (filters.price.length > 0) {
			filtered = filtered.filter((course) => {
				if (!course.price) return filters.price.includes("free");

				const priceInDollars = course.price / 100;

				return filters.price.some((priceRange) => {
					switch (priceRange) {
						case "free":
							return priceInDollars === 0;
						case "0-50":
							return priceInDollars > 0 && priceInDollars <= 50;
						case "50-100":
							return priceInDollars > 50 && priceInDollars <= 100;
						case "100+":
							return priceInDollars > 100;
						default:
							return true;
					}
				});
			});
		}

		// Apply sorting
		switch (sortBy) {
			case "highest-rated":
				filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
				break;
			case "newest":
				// Assuming newer courses have higher courseId or we could add a createdAt field
				filtered.sort((a, b) => b.courseId.localeCompare(a.courseId));
				break;
			case "most-popular":
			default:
				// Sort by enrollment count or rating as fallback
				filtered.sort(
					(a, b) =>
						(b.enrollments?.length || 0) - (a.enrollments?.length || 0) ||
						(b.rating || 0) - (a.rating || 0),
				);
				break;
		}

		return filtered;
	}, [courses, filters, sortBy]);

	const handleCourseClick = (course: Course) => {
		router.push(`/course/${course.courseId}`);
	};

	if (isLoading) return <Loading />;
	if (isError || !courses) return <div>Failed to fetch courses</div>;

	return (
		<div className="min-h-screen bg-customgreys-primarybg w-3/4 mx-auto">
			<div className="px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white-50 mb-2">
						All Available Courses
					</h1>
					<div className="flex items-center justify-between">
						<p className="text-customgreys-dirtyGrey">
							{filteredAndSortedCourses.length} results
						</p>
						<div className="flex items-center gap-4">
							<CourseSortDropdown />
							<CourseViewToggle />
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex gap-8">
					{/* Filters Sidebar */}
					<div className="w-64 flex-shrink-0">
						<CourseFilters />
					</div>

					{/* Courses Grid */}
					<div className="flex-1">
						{filteredAndSortedCourses.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-customgreys-dirtyGrey text-lg">
									No courses found matching your criteria.
								</p>
								<Button
									variant="outline"
									onClick={() => dispatch(clearFilters())}
									className="mt-4 border-customgreys-secondarybg text-white-50 hover:bg-customgreys-secondarybg"
								>
									Clear Filters
								</Button>
							</div>
						) : (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className={
									view === "grid"
										? "grid grid-cols-1 lg:grid-cols-2 gap-6"
										: "space-y-4"
								}
							>
								{filteredAndSortedCourses.map((course) => (
									<CourseCardSearch
										key={course.courseId}
										course={course}
										view={view}
										onClick={() => handleCourseClick(course)}
									/>
								))}
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Search;
