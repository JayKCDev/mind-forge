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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/schemas";
import { useAppDispatch } from "@/state/redux";
import { signupUser } from "@/state/authThunks";

const SignUpComponent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [showPassword, setShowPassword] = useState(false);
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
									First name
								</Label>
								<Input
									id="firstName"
									{...register("firstName")}
									className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
									placeholder="John"
								/>
								{errors.firstName && (
									<p className="text-red-400 text-sm">
										{errors.firstName.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName" className="text-white-50 font-normal">
									Last name
								</Label>
								<Input
									id="lastName"
									{...register("lastName")}
									className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
									placeholder="Doe"
								/>
								{errors.lastName && (
									<p className="text-red-400 text-sm">
										{errors.lastName.message}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-white-50 font-normal">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								{...register("email")}
								className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600"
								placeholder="john.doe@example.com"
							/>
							{errors.email && (
								<p className="text-red-400 text-sm">{errors.email.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-white-50 font-normal">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									{...register("password")}
									className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600 pr-10"
									placeholder="••••••••"
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-white-50" />
									) : (
										<Eye className="h-4 w-4 text-white-50" />
									)}
								</Button>
							</div>
							{errors.password && (
								<p className="text-red-400 text-sm">
									{errors.password.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="userType" className="text-white-50 font-normal">
								I want to
							</Label>
							<Select
								value={userType}
								onValueChange={(value) =>
									setValue("userType", value as "student" | "teacher")
								}
							>
								<SelectTrigger className="bg-customgreys-primarybg text-white-50 border-customgreys-darkerGrey focus:border-primary-600 focus:ring-primary-600">
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
								<p className="text-red-400 text-sm">
									{errors.userType.message}
								</p>
							)}
						</div>

						<Button
							type="submit"
							className="w-full bg-primary-700 text-white-100 hover:bg-primary-600 shadow-none"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating account...
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
								className="text-primary-750 hover:text-primary-600 font-medium"
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
