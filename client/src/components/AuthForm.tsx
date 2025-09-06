"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
import {
	signinSchema,
	signupSchema,
	type SigninFormData,
	type SignupFormData,
} from "@/lib/schemas";
import { useAppDispatch } from "@/state/redux";
import { loginUser, signupUser } from "@/state/authThunks";
import PasswordInput from "@/components/ui/password-input";

type AuthMode = "signin" | "signup";

interface AuthFormProps {
	initialMode: AuthMode;
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [authMode, setAuthMode] = useState<AuthMode>(initialMode);

	const isCheckoutPage = searchParams.get("showSignUp") !== null;
	const courseId = searchParams.get("id");

	const getRedirectUrl = () => {
		if (isCheckoutPage) {
			return `/checkout?step=2&id=${courseId}&showSignUp=false`;
		}
		return authMode === "signin" ? "/user/courses" : "/user/courses";
	};

	// Sign In Form
	const signInForm = useForm<SigninFormData>({
		resolver: zodResolver(signinSchema),
	});

	// Sign Up Form
	const signUpForm = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			userType: "student",
		},
	});

	const userType = signUpForm.watch("userType");

	const onSignInSubmit = async (data: SigninFormData) => {
		setIsLoading(true);
		try {
			const result = await dispatch(loginUser(data)).unwrap();
			toast.success("Signed in successfully!");

			if (result.user.userType === "teacher") {
				router.push("/teacher/courses");
			} else {
				router.push(getRedirectUrl());
			}
		} catch (error) {
			console.error("Signin error:", error);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const onSignUpSubmit = async (data: SignupFormData) => {
		setIsLoading(true);
		try {
			const result = await dispatch(signupUser(data)).unwrap();
			toast.success("Account created successfully!");

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

	const toggleAuthMode = () => {
		const newMode = authMode === "signin" ? "signup" : "signin";

		// Navigate to the appropriate route
		if (isCheckoutPage) {
			// Handle checkout flow
			const newSearchParams = new URLSearchParams(searchParams.toString());
			if (newMode === "signup") {
				newSearchParams.set("showSignUp", "true");
			} else {
				newSearchParams.delete("showSignUp");
			}
			const newUrl = `/checkout?${newSearchParams.toString()}`;
			router.push(newUrl);
		} else {
			// Handle regular auth flow
			const newUrl = newMode === "signup" ? "/signup" : "/signin";
			router.push(newUrl);
		}
	};

	return (
		<div className="flex justify-center items-center py-5">
			<Card className="bg-customgreys-secondarybg w-full max-w-md shadow-none border-customgreys-darkerGrey">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-white-100 text-center">
						{authMode === "signin" ? "Welcome back" : "Create your account"}
					</CardTitle>
					<CardDescription className="text-white-50 text-center">
						{authMode === "signin"
							? "Enter your credentials to access your account"
							: "Enter your information to get started"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{authMode === "signin" ? (
						<form
							onSubmit={signInForm.handleSubmit(onSignInSubmit)}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-white-50 font-normal">
									Email <span className="text-red-400">*</span>
								</Label>
								<Input
									id="email"
									type="email"
									{...signInForm.register("email")}
									className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
									placeholder="john.doe@example.com"
									aria-describedby={
										signInForm.formState.errors.email
											? "email-error"
											: undefined
									}
									aria-required="true"
								/>
								{signInForm.formState.errors.email && (
									<p
										id="email-error"
										className="text-red-400 text-sm"
										role="alert"
									>
										{signInForm.formState.errors.email.message}
									</p>
								)}
							</div>

							<PasswordInput
								id="password"
								label="Password"
								register={signInForm.register("password")}
								error={signInForm.formState.errors.password?.message}
								required
							/>

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
										Signing in...
										<span id="loading-description" className="sr-only">
											Please wait while we sign you in
										</span>
									</>
								) : (
									"Sign in"
								)}
							</Button>
						</form>
					) : (
						<form
							onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
							className="space-y-4"
						>
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
										{...signUpForm.register("firstName")}
										className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
										placeholder="John"
										aria-describedby={
											signUpForm.formState.errors.firstName
												? "firstName-error"
												: undefined
										}
										aria-required="true"
									/>
									{signUpForm.formState.errors.firstName && (
										<p
											id="firstName-error"
											className="text-red-400 text-sm"
											role="alert"
										>
											{signUpForm.formState.errors.firstName.message}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="lastName"
										className="text-white-50 font-normal"
									>
										Last name <span className="text-red-400">*</span>
									</Label>
									<Input
										id="lastName"
										{...signUpForm.register("lastName")}
										className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
										placeholder="Doe"
										aria-describedby={
											signUpForm.formState.errors.lastName
												? "lastName-error"
												: undefined
										}
										aria-required="true"
									/>
									{signUpForm.formState.errors.lastName && (
										<p
											id="lastName-error"
											className="text-red-400 text-sm"
											role="alert"
										>
											{signUpForm.formState.errors.lastName.message}
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
									{...signUpForm.register("email")}
									className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
									placeholder="john.doe@example.com"
									aria-describedby={
										signUpForm.formState.errors.email
											? "email-error"
											: undefined
									}
									aria-required="true"
								/>
								{signUpForm.formState.errors.email && (
									<p
										id="email-error"
										className="text-red-400 text-sm"
										role="alert"
									>
										{signUpForm.formState.errors.email.message}
									</p>
								)}
							</div>

							<PasswordInput
								id="password"
								label="Password"
								register={signUpForm.register("password")}
								error={signUpForm.formState.errors.password?.message}
								required
							/>

							<div className="space-y-2">
								<Label htmlFor="userType" className="text-white-50 font-normal">
									I want to <span className="text-red-400">*</span>
								</Label>
								<Select
									value={userType}
									onValueChange={(value) =>
										signUpForm.setValue(
											"userType",
											value as "student" | "teacher",
										)
									}
								>
									<SelectTrigger
										className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
										aria-describedby={
											signUpForm.formState.errors.userType
												? "userType-error"
												: undefined
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
								{signUpForm.formState.errors.userType && (
									<p
										id="userType-error"
										className="text-red-400 text-sm"
										role="alert"
									>
										{signUpForm.formState.errors.userType.message}
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
					)}

					<Separator className="my-6 bg-customgreys-darkerGrey" />

					<div className="text-center">
						<p className="text-white-50 text-sm">
							{authMode === "signin"
								? "Don't have an account? "
								: "Already have an account? "}
							<button
								type="button"
								onClick={toggleAuthMode}
								className="text-primary-750 hover:text-primary-600 font-medium focus:outline-none focus:ring-0 focus:ring-offset-0 rounded"
							>
								{authMode === "signin" ? "Sign up" : "Sign in"}
							</button>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default AuthForm;
