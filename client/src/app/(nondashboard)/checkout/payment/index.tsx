import React, { useEffect } from "react";
import StripeProvider from "./StripeProvider";
import {
	PaymentElement,
	AddressElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useAuth } from "@/hooks/useAuth";
import CoursePreview from "@/components/CoursePreview";
import { CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTransactionMutation } from "@/state/api";
import { toast } from "sonner";
import { getBaseUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const PaymentPageContent = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [createTransaction] = useCreateTransactionMutation();
	const { navigateToStep, isGuestCheckout } = useCheckoutNavigation();
	const { course, courseId } = useCurrentCourse();
	const { user, logout, isAuthenticated } = useAuth();
	const searchParams = useSearchParams();
	const guestEmail = searchParams.get("email");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) {
			toast.error("Stripe service is not available");
			return;
		}

		const baseUrl = getBaseUrl();

		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${baseUrl}/checkout?step=3&id=${courseId}`,
			},
			redirect: "if_required",
		});

		if (result.paymentIntent?.status === "succeeded") {
			const transactionData: Partial<Transaction> = {
				transactionId: result.paymentIntent.id,
				userId: user?.userId || `guest_${guestEmail}`, // Handle guest users
				courseId: courseId,
				paymentProvider: "stripe",
				amount: course?.price || 0,
			};

			await createTransaction(transactionData), navigateToStep(3);
		}
	};

	const handleSignOutAndNavigate = async () => {
		logout();
		navigateToStep(1);
	};

	const handleBackToDetails = () => {
		navigateToStep(1);
	};

	useEffect(() => {
		// Show the toast and store its ID
		const cardInfoToast = toast.info(
			"For dummy transaction, use below credentials:\nCard Number: 4242 4242 4242 4242\nExpiry: 03/33\n CVC: 333",
			{
				duration: Infinity,
				style: { whiteSpace: "pre-line" }, // Enables `\n` to work
			}
		);

		// Cleanup function to remove the toast when component unmounts
		return () => {
			toast.dismiss(cardInfoToast);
		};
	}, []);

	if (!course) return null;

	return (
		<div className="payment">
			<div className="payment__container">
				{/* Order Summary */}
				<div className="payment__preview">
					<CoursePreview course={course} />
				</div>

				{/* Payment Form */}
				<div className="payment__form-container">
					<form
						id="payment-form"
						onSubmit={handleSubmit}
						className="payment__form"
					>
						<div className="payment__content">
							<h1 className="payment__title">Checkout</h1>
							<p className="payment__subtitle">
								Fill out the payment details below to complete your purchase.
							</p>

							{/* Show user info for authenticated users or guest email */}
							{isAuthenticated && user ? (
								<div className="mb-4 p-3 bg-white-10 rounded-lg">
									<div className="flex items-center gap-2">
										<User size={16} />
										<span className="text-sm text-white-50">
											Paying as: {user.firstName} {user.lastName} ({user.email})
										</span>
									</div>
								</div>
							) : isGuestCheckout && guestEmail ? (
								<div className="mb-4 p-3 bg-white-10 rounded-lg">
									<div className="flex items-center gap-2">
										<User size={16} />
										<span className="text-sm text-white-50">
											Guest checkout: {guestEmail}
										</span>
									</div>
								</div>
							) : null}

							<div className="payment__method">
								<h3 className="payment__method-title">Payment Method</h3>

								<div className="payment__card-container">
									<div className="card-header">
										<CreditCard size={24} />
										<span>Credit/Debit Card</span>
									</div>
									<div className="card-element">
										<AddressElement options={{ mode: "billing" }} />
									</div>
									<div className="card-element">
										<PaymentElement />
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className="payment__actions">
				{isAuthenticated ? (
					<Button
						className="hover:bg-white-50/10"
						onClick={handleSignOutAndNavigate}
						variant="outline"
						type="button"
					>
						Switch Account
					</Button>
				) : (
					<Button
						className="hover:bg-white-50/10"
						onClick={handleBackToDetails}
						variant="outline"
						type="button"
					>
						Back to Details
					</Button>
				)}

				<Button
					form="payment-form"
					type="submit"
					className="payment__submit"
					disabled={!stripe || !elements}
				>
					Pay with Credit Card
				</Button>
			</div>
		</div>
	);
};

const PaymentPage = () => (
	<StripeProvider>
		<PaymentPageContent />
	</StripeProvider>
);

export default PaymentPage;
