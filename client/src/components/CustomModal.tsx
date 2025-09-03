import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

const CustomModal: React.FC<CustomModalProps> = ({
	isOpen,
	onClose,
	children,
	title,
	description,
	size = "md",
}) => {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogOverlay
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
				onClick={onClose}
				aria-label="Close modal"
			/>
			<DialogContent
				className={`${sizeClasses[size]} bg-customgreys-secondarybg border-customgreys-darkerGrey shadow-xl`}
				onEscapeKeyDown={onClose}
				onInteractOutside={onClose}
			>
				{(title || description) && (
					<div className="mb-4">
						{title && (
							<h2 className="text-xl font-semibold text-white-100 mb-2">
								{title}
							</h2>
						)}
						{description && (
							<p className="text-customgreys-dirtyGrey text-sm">
								{description}
							</p>
						)}
					</div>
				)}
				<div className="custom-modal__inner">{children}</div>
			</DialogContent>
		</Dialog>
	);
};

export default CustomModal;
