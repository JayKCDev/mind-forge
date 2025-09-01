"use client";

import CoursePreview from "@/components/CoursePreview";
import { CustomFormField } from "@/components/CustomFormField";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useAuth } from "@/hooks/useAuth";
import { GuestFormData, guestSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import SignUpComponent from "@/components/SignUp";
import SignInComponent from "@/components/SignIn";

const CheckoutDetailsPage = () => {
	const { course: selectedCourse, isLoading, isError } = useCurrentCourse();
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const searchParams = useSearchParams();
	const router = useRouter();
	const showSignUp = searchParams.get("showSignUp") === "true";

	const methods = useForm<GuestFormData>({
		resolver: zodResolver(guestSchema),
		defaultValues: {
			email: "",
		},
	});

	// If user is already authenticated, redirect to payment step
	React.useEffect(() => {
		if (!authLoading && isAuthenticated && user) {
			const courseId = searchParams.get("id");
			if (courseId) {
				router.push(`/checkout?step=2&id=${courseId}`);
			}
		}
	}, [isAuthenticated, user, authLoading, router, searchParams]);

	// Show loading while checking authentication
	if (authLoading || isLoading) return <Loading />;
	if (isError) return <div>Failed to fetch course data</div>;
	if (!selectedCourse) return <div>Course not found</div>;

	// If user is authenticated, show a loading state while redirecting
	if (isAuthenticated && user) {
		return (
			<div className="checkout-details">
				<div className="checkout-details__container">
					<div className="checkout-details__preview">
						<CoursePreview course={selectedCourse} />
					</div>
					<div className="checkout-details__options">
						<div className="flex items-center justify-center h-64">
							<Loading />
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Show guest checkout and login forms only for unauthenticated users
	return (
		<div className="checkout-details">
			<div className="checkout-details__container">
				<div className="checkout-details__preview">
					<CoursePreview course={selectedCourse} />
				</div>

				{/* Guest checkout and authentication options - only for unauthenticated users */}
				<div className="checkout-details__options">
					<div className="checkout-details__guest">
						<h2 className="checkout-details__title">Guest Checkout</h2>
						<p className="checkout-details__subtitle">
							Enter email to receive course access details and order
							confirmation. You can create an account after purchase.
						</p>
						<Form {...methods}>
							<form
								onSubmit={methods.handleSubmit((data) => {
									console.log(data);
									// Handle guest checkout logic here
									const courseId = searchParams.get("id");
									if (courseId) {
										router.push(
											`/checkout?step=2&id=${courseId}&guest=true&email=${data.email}`
										);
									}
								})}
								className="checkout-details__form"
							>
								<CustomFormField
									name="email"
									label="Email address"
									type="email"
									className="w-full rounded mt-4"
									labelClassName="font-normal text-white-50"
									inputClassName="py-3"
								/>
								<Button type="submit" className="checkout-details__submit">
									Continue as Guest
								</Button>
							</form>
						</Form>
					</div>

					<div className="checkout-details__divider">
						<hr className="checkout-details__divider-line" />
						<span className="checkout-details__divider-text">Or</span>
						<hr className="checkout-details__divider-line" />
					</div>

					<div className="checkout-details__auth">
						{showSignUp ? <SignUpComponent /> : <SignInComponent />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutDetailsPage;
