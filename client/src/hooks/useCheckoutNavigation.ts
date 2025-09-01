"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

export const useCheckoutNavigation = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { isLoading, isAuthenticated } = useAuth();

	const courseId = searchParams.get("id") ?? "";
	const checkoutStep = parseInt(searchParams.get("step") ?? "1", 10);
	const isGuestCheckout = searchParams.get("guest") === "true";

	const navigateToStep = useCallback(
		(step: number) => {
			const newStep = Math.min(Math.max(1, step), 3);

			// Build the URL with appropriate parameters
			let url = `/checkout?step=${newStep}&id=${courseId}`;

			// Add guest checkout parameters if applicable
			if (isGuestCheckout) {
				const guestEmail = searchParams.get("email");
				if (guestEmail) {
					url += `&guest=true&email=${guestEmail}`;
				}
			}

			// Add showSignUp parameter for unauthenticated users
			if (!isAuthenticated && !isGuestCheckout) {
				const showSignUp = searchParams.get("showSignUp") || "false";
				url += `&showSignUp=${showSignUp}`;
			}

			router.push(url, {
				scroll: false,
			});
		},
		[courseId, isAuthenticated, isGuestCheckout, router, searchParams]
	);

	useEffect(() => {
		// If user is not authenticated and not doing guest checkout, redirect to step 1
		if (
			!isLoading &&
			!isAuthenticated &&
			!isGuestCheckout &&
			checkoutStep > 1
		) {
			navigateToStep(1);
		}

		// If user is authenticated and on step 1, redirect to step 2
		if (!isLoading && isAuthenticated && checkoutStep === 1) {
			navigateToStep(2);
		}
	}, [
		isLoading,
		isAuthenticated,
		isGuestCheckout,
		checkoutStep,
		navigateToStep,
	]);

	return { checkoutStep, navigateToStep, isGuestCheckout };
};
