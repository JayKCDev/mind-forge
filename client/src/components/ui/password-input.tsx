import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { UseFormRegisterReturn } from "react-hook-form";

const PasswordInput: React.FC<PasswordInputProps> = ({
	id,
	label,
	register,
	error,
	placeholder = "••••••••",
	className = "",
	labelClassName = "",
	inputClassName = "",
	disabled = false,
	required = false,
}) => {
	const { showPassword, togglePasswordVisibility, passwordType } =
		usePasswordVisibility();

	return (
		<div className={`space-y-2 ${className}`}>
			<Label
				htmlFor={id}
				className={`text-white-50 font-normal ${labelClassName}`}
			>
				{label}
				{required && <span className="text-red-400 ml-1">*</span>}
			</Label>
			<div className="relative">
				<Input
					id={id}
					type={passwordType}
					{...register}
					className={`bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600 pr-10 ${inputClassName}`}
					placeholder={placeholder}
					disabled={disabled}
					aria-describedby={error ? `${id}-error` : undefined}
				/>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
					onClick={togglePasswordVisibility}
					aria-label={showPassword ? "Hide password" : "Show password"}
				>
					{showPassword ? (
						<EyeOff className="h-4 w-4 text-white-50" />
					) : (
						<Eye className="h-4 w-4 text-white-50" />
					)}
				</Button>
			</div>
			{error && (
				<p id={`${id}-error`} className="text-red-400 text-sm" role="alert">
					{error}
				</p>
			)}
		</div>
	);
};

export default PasswordInput;
