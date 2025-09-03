import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const CourseCard: React.FC<CourseCardProps> = ({
	course,
	onGoToCourse,
	className = "",
	showPrice = true,
	showCategory = true,
}) => {
	const handleClick = () => {
		onGoToCourse(course);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleClick();
		}
	};

	return (
		<Card
			className={`course-card group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${className}`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			role="button"
			aria-label={`View course: ${course.title}`}
		>
			<CardHeader className="course-card__header p-0">
				<div className="relative overflow-hidden rounded-t-lg">
					<Image
						src={course.image || "/placeholder.png"}
						alt={`Course thumbnail for ${course.title}`}
						width={400}
						height={350}
						className="course-card__image w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
						priority
					/>
					{course.status === "Draft" && (
						<Badge
							variant="secondary"
							className="absolute top-2 right-2 bg-yellow-600 text-white"
						>
							Draft
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="course-card__content p-4 space-y-3">
				<CardTitle className="course-card__title text-lg font-semibold text-white-100 line-clamp-2">
					{course.title}
				</CardTitle>

				{course.description && (
					<p className="text-customgreys-dirtyGrey text-sm line-clamp-2">
						{course.description}
					</p>
				)}

				<div className="flex items-center gap-2">
					<Avatar className="w-6 h-6">
						<AvatarImage src="" alt={`${course.teacherName}'s avatar`} />
						<AvatarFallback className="bg-secondary-700 text-black text-xs">
							{course.teacherName?.[0] || "T"}
						</AvatarFallback>
					</Avatar>
					<p className="text-sm text-customgreys-dirtyGrey font-medium">
						{course.teacherName}
					</p>
				</div>

				<div className="flex items-center justify-between">
					{showCategory && (
						<Badge variant="outline" className="text-xs">
							{course.category}
						</Badge>
					)}
					{showPrice && course.price && (
						<span className="course-card__price text-lg font-bold text-primary-600">
							{formatPrice(course.price)}
						</span>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default CourseCard;
