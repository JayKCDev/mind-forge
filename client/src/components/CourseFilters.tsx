"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/state/redux";
import {
	setRatingFilter,
	setLevelFilter,
	setPriceFilter,
} from "@/state/searchSlice";

interface FilterOption {
	value: string;
	label: string;
	count?: number;
}

interface FilterSectionProps {
	title: string;
	type: "radio" | "checkbox";
	options: FilterOption[];
	value: string | string[];
	onChange: (value: string | string[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
	title,
	type,
	options,
	value,
	onChange,
}) => {
	const handleRadioChange = (newValue: string) => {
		onChange(newValue);
	};

	const handleCheckboxChange = (optionValue: string, checked: boolean) => {
		const currentValues = Array.isArray(value) ? value : [];
		if (checked) {
			onChange([...currentValues, optionValue]);
		} else {
			onChange(currentValues.filter((v) => v !== optionValue));
		}
	};

	return (
		<Card className="mb-4 bg-customgreys-secondarybg border-customgreys-secondarybg">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-medium text-white-50">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				{type === "radio" ? (
					<RadioGroup value={value as string} onValueChange={handleRadioChange}>
						{options.map((option) => (
							<div key={option.value} className="flex items-center space-x-2">
								<RadioGroupItem value={option.value} id={option.value} />
								<Label
									htmlFor={option.value}
									className="text-sm font-normal cursor-pointer flex items-center justify-between w-full text-customgreys-dirtyGrey"
								>
									<span>{option.label}</span>
									{option.count && (
										<Badge
											variant="secondary"
											className="text-xs bg-customgreys-darkerGrey text-white-50"
										>
											{option.count}
										</Badge>
									)}
								</Label>
							</div>
						))}
					</RadioGroup>
				) : (
					<div className="space-y-2">
						{options.map((option) => (
							<div key={option.value} className="flex items-center space-x-2">
								<Checkbox
									id={option.value}
									checked={Array.isArray(value) && value.includes(option.value)}
									onCheckedChange={(checked) =>
										handleCheckboxChange(option.value, checked as boolean)
									}
								/>
								<Label
									htmlFor={option.value}
									className="text-sm font-normal cursor-pointer flex items-center justify-between w-full text-customgreys-dirtyGrey"
								>
									<span>{option.label}</span>
									{option.count && (
										<Badge
											variant="secondary"
											className="text-xs bg-customgreys-darkerGrey text-white-50"
										>
											{option.count}
										</Badge>
									)}
								</Label>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

const CourseFilters: React.FC = () => {
	const dispatch = useAppDispatch();
	const { filters } = useAppSelector((state) => state.search);
	const ratingOptions: FilterOption[] = [
		{ value: "4.5", label: "4.5 & up", count: 45 },
		{ value: "4.0", label: "4.0 & up", count: 82 },
		{ value: "3.5", label: "3.5 & up", count: 89 },
		{ value: "3.0", label: "3.0 & up", count: 91 },
	];

	const levelOptions: FilterOption[] = [
		{ value: "Beginner", label: "Beginner", count: 45 },
		{ value: "Intermediate", label: "Intermediate", count: 32 },
		{ value: "Advanced", label: "Advanced", count: 24 },
	];

	const priceOptions: FilterOption[] = [
		{ value: "free", label: "Free", count: 12 },
		{ value: "0-50", label: "Under $50", count: 28 },
		{ value: "50-100", label: "$50 - $100", count: 25 },
		{ value: "100+", label: "$100+", count: 22 },
	];

	const handleFilterChange = (
		filterType: keyof typeof filters,
		value: string | string[],
	) => {
		switch (filterType) {
			case "ratings":
				dispatch(setRatingFilter(value as string));
				break;
			case "level":
				dispatch(setLevelFilter(value as string[]));
				break;
			case "price":
				dispatch(setPriceFilter(value as string[]));
				break;
		}
	};

	return (
		<div className="w-64 space-y-4">
			<h3 className="text-lg font-semibold text-white-50">Filters</h3>

			<FilterSection
				title="Ratings"
				type="radio"
				options={ratingOptions}
				value={filters.ratings}
				onChange={(value) => handleFilterChange("ratings", value as string)}
			/>

			<Separator />

			<FilterSection
				title="Level"
				type="checkbox"
				options={levelOptions}
				value={filters.level}
				onChange={(value) => handleFilterChange("level", value as string[])}
			/>

			<Separator />

			<FilterSection
				title="Price"
				type="checkbox"
				options={priceOptions}
				value={filters.price}
				onChange={(value) => handleFilterChange("price", value as string[])}
			/>
		</div>
	);
};

export default CourseFilters;
