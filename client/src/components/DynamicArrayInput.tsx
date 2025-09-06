"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, AlertCircle } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CourseFormDataExplicit } from "@/lib/schemas";

interface DynamicArrayInputProps {
	name: "whatYoullLearn" | "requirements";
	label: string;
	placeholder: string;
	minItems: number;
	maxItems: number;
	description?: string;
}

const DynamicArrayInput: React.FC<DynamicArrayInputProps> = ({
	name,
	label,
	placeholder,
	minItems,
	maxItems,
	description,
}) => {
	const {
		control,
		formState: { errors },
	} = useFormContext<CourseFormDataExplicit>();

	const { fields, append, remove } = useFieldArray({
		control,
		name,
	});

	const fieldErrors = errors[name] as any;
	const hasError = fieldErrors && fieldErrors.length > 0;

	const addItem = () => {
		if (fields.length < maxItems) {
			append("");
		}
	};

	const removeItem = (index: number) => {
		if (fields.length > minItems) {
			remove(index);
		}
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<Label className="text-sm font-medium text-customgreys-dirtyGrey">
					{label}
				</Label>
				<div className="text-xs text-customgreys-dirtyGrey">
					{fields.length}/{maxItems}
				</div>
			</div>

			{description && (
				<p className="text-xs text-customgreys-dirtyGrey">{description}</p>
			)}

			<div className="space-y-2">
				<AnimatePresence>
					{fields.map((field, index) => (
						<motion.div
							key={field.id}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="flex items-center gap-2"
						>
							<div className="flex-1">
								<Input
									placeholder={placeholder}
									className={`border-customgreys-dirtyGrey ${
										fieldErrors?.[index] ? "border-red-500" : ""
									}`}
									{...useFormContext().register(`${name}.${index}` as const)}
								/>
								{fieldErrors?.[index] && (
									<p className="text-xs text-red-500 mt-1 flex items-center gap-1">
										<AlertCircle className="w-3 h-3" />
										{fieldErrors[index]?.message}
									</p>
								)}
							</div>

							{fields.length > minItems && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => removeItem(index)}
									className="border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600"
								>
									<X className="w-4 h-4" />
								</Button>
							)}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{fields.length < maxItems && (
				<Button
					type="button"
					variant="outline"
					onClick={addItem}
					className="w-full border-dashed border-customgreys-dirtyGrey text-customgreys-dirtyGrey hover:bg-customgreys-dirtyGrey hover:text-white"
				>
					<Plus className="w-4 h-4 mr-2" />
					Add {label.slice(0, -1)}
				</Button>
			)}

			{hasError &&
				typeof fieldErrors === "object" &&
				!Array.isArray(fieldErrors) && (
					<p className="text-xs text-red-500 flex items-center gap-1">
						<AlertCircle className="w-3 h-3" />
						{fieldErrors.message}
					</p>
				)}
		</div>
	);
};

export default DynamicArrayInput;
