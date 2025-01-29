import AccordionSections from "@/components/AccordionSections";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const SelectedCourse = ({ course, handleEnrollNow }: SelectedCourseProps) => {
	let isCurrentUserEnrolled: boolean = false;
	const { user, isLoaded } = useUser();
	const enrolledStudents = course?.enrollments.map(
		(enrollment) => enrollment.userId
	);
	console.log(enrolledStudents);
	console.log(course);
	console.log(user);

	if (user && enrolledStudents?.length && enrolledStudents?.includes(user.id))
		isCurrentUserEnrolled = true;

	console.log(isCurrentUserEnrolled);

	return (
		<div className="selected-course">
			<div>
				<h3 className="selected-course__title">{course.title}</h3>
				<p className="selected-course__author">
					By {course.teacherName} |{" "}
					<span className="selected-course__enrollment-count">
						{course?.enrollments?.length}
					</span>
				</p>
			</div>

			<div className="selected-course__content">
				<p className="selected-course__description">{course.description}</p>

				<div className="selected-course__sections">
					<h4 className="selected-course__sections-title">Course Content</h4>
					<AccordionSections sections={course.sections} />
				</div>

				<div className="selected-course__footer">
					{isCurrentUserEnrolled ? (
						<Link href="user/courses" scroll={false}>
							Go to Courses
						</Link>
					) : (
						<>
							<span className="selected-course__price">
								{formatPrice(course.price)}
							</span>
							<Button
								onClick={() => handleEnrollNow(course.courseId)}
								className="bg-primary-700 hover:bg-primary-600"
							>
								Enroll Now
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SelectedCourse;
