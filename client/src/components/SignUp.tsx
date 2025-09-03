"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/schemas";
import { useAppDispatch } from "@/state/redux";
import { signupUser } from "@/state/authThunks";
import PasswordInput from "@/components/ui/password-input";

const SignUpComponent: React.FC = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const isCheckoutPage = searchParams.get("showSignUp") !== null;
	const courseId = searchParams.get("id");

	const signInUrl = isCheckoutPage
		? `/checkout?step=1&id=${courseId}&showSignUp=false`
		: "/signin";

	const getRedirectUrl = () => {
		if (isCheckoutPage) {
			return `/checkout?step=2&id=${courseId}&showSignUp=false`;
		}
		return "/user/courses"; // Default redirect for new users
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			userType: "student",
		},
	});

	const userType = watch("userType");

	const onSubmit = async (data: SignupFormData) => {
		setIsLoading(true);
		try {
			// Use Redux thunk for signup
			const result = await dispatch(signupUser(data)).unwrap();

			toast.success("Account created successfully!");

			// Redirect based on user type
			if (data.userType === "teacher") {
				router.push("/teacher/courses");
			} else {
				router.push(getRedirectUrl());
			}
		} catch (error) {
			console.error("Signup error:", error);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center py-5">
			<Card className="bg-customgreys-secondarybg w-full max-w-md shadow-none border-customgreys-darkerGrey">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-white-100 text-center">
						Create your account
					</CardTitle>
					<CardDescription className="text-white-50 text-center">
						Enter your information to get started
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="firstName"
									className="text-white-50 font-normal"
								>
									First name <span className="text-red-400">*</span>
								</Label>
								<Input
									id="firstName"
									{...register("firstName")}
									className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
									placeholder="John"
									aria-describedby={
										errors.firstName ? "firstName-error" : undefined
									}
									aria-required="true"
								/>
								{errors.firstName && (
									<p
										id="firstName-error"
										className="text-red-400 text-sm"
										role="alert"
									>
										{errors.firstName.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName" className="text-white-50 font-normal">
									Last name <span className="text-red-400">*</span>
								</Label>
								<Input
									id="lastName"
									{...register("lastName")}
									className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
									placeholder="Doe"
									aria-describedby={
										errors.lastName ? "lastName-error" : undefined
									}
									aria-required="true"
								/>
								{errors.lastName && (
									<p
										id="lastName-error"
										className="text-red-400 text-sm"
										role="alert"
									>
										{errors.lastName.message}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-white-50 font-normal">
								Email <span className="text-red-400">*</span>
							</Label>
							<Input
								id="email"
								type="email"
								{...register("email")}
								className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
								placeholder="john.doe@example.com"
								aria-describedby={errors.email ? "email-error" : undefined}
								aria-required="true"
							/>
							{errors.email && (
								<p
									id="email-error"
									className="text-red-400 text-sm"
									role="alert"
								>
									{errors.email.message}
								</p>
							)}
						</div>

						<PasswordInput
							id="password"
							label="Password"
							register={register("password")}
							error={errors.password?.message}
							required
						/>

						<div className="space-y-2">
							<Label htmlFor="userType" className="text-white-50 font-normal">
								I want to <span className="text-red-400">*</span>
							</Label>
							<Select
								value={userType}
								onValueChange={(value) =>
									setValue("userType", value as "student" | "teacher")
								}
							>
								<SelectTrigger
									className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
									aria-describedby={
										errors.userType ? "userType-error" : undefined
									}
									aria-required="true"
								>
									<SelectValue placeholder="Select your role" />
								</SelectTrigger>
								<SelectContent className="bg-customgreys-primarybg border-customgreys-darkerGrey">
									<SelectItem
										value="student"
										className="text-white-50 hover:bg-customgreys-darkGrey"
									>
										Learn and take courses
									</SelectItem>
									<SelectItem
										value="teacher"
										className="text-white-50 hover:bg-customgreys-darkGrey"
									>
										Teach and create courses
									</SelectItem>
								</SelectContent>
							</Select>
							{errors.userType && (
								<p
									id="userType-error"
									className="text-red-400 text-sm"
									role="alert"
								>
									{errors.userType.message}
								</p>
							)}
						</div>

						<Button
							type="submit"
							className="w-full bg-primary-700 text-white-100 hover:bg-primary-600 shadow-none"
							disabled={isLoading}
							aria-describedby={isLoading ? "loading-description" : undefined}
						>
							{isLoading ? (
								<>
									<Loader2
										className="mr-2 h-4 w-4 animate-spin"
										aria-hidden="true"
									/>
									Creating account...
									<span id="loading-description" className="sr-only">
										Please wait while we create your account
									</span>
								</>
							) : (
								"Create account"
							)}
						</Button>
					</form>

					<Separator className="my-6 bg-customgreys-darkerGrey" />

					<div className="text-center">
						<p className="text-white-50 text-sm">
							Already have an account?{" "}
							<a
								href={signInUrl}
								className="text-primary-750 hover:text-primary-600 font-medium focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 rounded"
							>
								Sign in
							</a>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SignUpComponent;
