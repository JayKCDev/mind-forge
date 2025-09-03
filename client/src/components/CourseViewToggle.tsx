"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/state/redux";
import { setView } from "@/state/searchSlice";

const CourseViewToggle: React.FC = () => {
	const dispatch = useAppDispatch();
	const { view } = useAppSelector((state) => state.search);
	return (
		<div className="flex items-center gap-1 border border-customgreys-secondarybg rounded-md p-1 bg-customgreys-secondarybg">
			<Button
				variant={view === "grid" ? "default" : "ghost"}
				size="sm"
				onClick={() => dispatch(setView("grid"))}
				className={`h-8 w-8 p-0 ${
					view === "grid"
						? "bg-primary-700 hover:bg-primary-600 text-white-50"
						: "text-customgreys-dirtyGrey hover:bg-customgreys-darkerGrey hover:text-white-50"
				}`}
			>
				<LayoutGrid className="h-4 w-4" />
			</Button>
			<Button
				variant={view === "list" ? "default" : "ghost"}
				size="sm"
				onClick={() => dispatch(setView("list"))}
				className={`h-8 w-8 p-0 ${
					view === "list"
						? "bg-primary-700 hover:bg-primary-600 text-white-50"
						: "text-customgreys-dirtyGrey hover:bg-customgreys-darkerGrey hover:text-white-50"
				}`}
			>
				<List className="h-4 w-4" />
			</Button>
		</div>
	);
};

export default CourseViewToggle;
