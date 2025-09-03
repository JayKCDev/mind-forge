"use client";

import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/state/redux";
import { setSortBy } from "@/state/searchSlice";

const CourseSortDropdown: React.FC = () => {
	const dispatch = useAppDispatch();
	const { sortBy } = useAppSelector((state) => state.search);
	const sortOptions = [
		{ value: "most-popular", label: "Most Popular" },
		{ value: "highest-rated", label: "Highest Rated" },
		{ value: "newest", label: "Newest" },
	];

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm font-medium text-customgreys-dirtyGrey">
				Sort by:
			</span>
			<Select
				value={sortBy}
				onValueChange={(value) => dispatch(setSortBy(value))}
			>
				<SelectTrigger className="w-40 bg-customgreys-secondarybg border-customgreys-secondarybg text-white-50">
					<SelectValue placeholder="Select sort option" />
				</SelectTrigger>
				<SelectContent className="bg-customgreys-secondarybg border-customgreys-secondarybg">
					{sortOptions.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
							className="text-white-50 hover:bg-customgreys-darkerGrey cursor-pointer"
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default CourseSortDropdown;
