import { Loader2 } from "lucide-react";
import React from "react";



const Loading: React.FC<LoadingProps> = ({
	text = "Loading...",
	size = "md",
	className = "",
	fullScreen = false,
}) => {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	const containerClasses = fullScreen
		? "fixed inset-0 flex items-center justify-center bg-customgreys-primarybg z-50"
		: "flex items-center justify-center p-4";

	return (
		<div
			className={`${containerClasses} ${className}`}
			role="status"
			aria-live="polite"
			aria-label={text}
		>
			<div className="flex flex-col items-center gap-3">
				<Loader2
					className={`${sizeClasses[size]} animate-spin text-primary-600`}
					aria-hidden="true"
				/>
				<span className="text-sm text-customgreys-dirtyGrey font-medium">
					{text}
				</span>
			</div>
		</div>
	);
};

export default Loading;
