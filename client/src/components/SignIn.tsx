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
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninFormData } from "@/lib/schemas";
import { useAppDispatch } from "@/state/redux";
import { loginUser } from "@/state/authThunks";
import PasswordInput from "@/components/ui/password-input";

const SignInComponent: React.FC = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const isCheckoutPage = searchParams.get("showSignUp") !== null;
	const courseId = searchParams.get("id");

	const signUpUrl = isCheckoutPage
		? `/checkout?step=1&id=${courseId}&showSignUp=true`
		: "/signup";

	const getRedirectUrl = () => {
		if (isCheckoutPage) {
			return `/checkout?step=2&id=${courseId}&showSignUp=false`;
		}
		return "/user/courses"; // Default redirect for signed in users
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SigninFormData>({
		resolver: zodResolver(signinSchema),
	});

	const onSubmit = async (data: SigninFormData) => {
		setIsLoading(true);
		try {
			// Use Redux thunk for login
			const result = await dispatch(loginUser(data)).unwrap();

			toast.success("Signed in successfully!");

			// Redirect based on user type
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

	return (
		<div className="flex justify-center items-center py-5">
			<Card className="bg-customgreys-secondarybg w-full max-w-md shadow-none border-customgreys-darkerGrey">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-white-100 text-center">
						Welcome back
					</CardTitle>
					<CardDescription className="text-white-50 text-center">
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

					<Separator className="my-6 bg-customgreys-darkerGrey" />

					<div className="text-center">
						<p className="text-white-50 text-sm">
							Don&apos;t have an account?{" "}
							<a
								href={signUpUrl}
								className="text-primary-750 hover:text-primary-600 font-medium focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 rounded"
							>
								Sign up
							</a>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SignInComponent;
