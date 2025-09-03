import React from "react";

const PricingCard = () => {
	return (
		<div className="pricing-card sticky top-0 p-4 bg-white shadow-md">
			<h2 className="text-2xl font-bold">$99.99</h2>
			<button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
				Add to Cart
			</button>
			<button className="mt-2 w-full bg-green-500 text-white py-2 rounded">
				Buy Now
			</button>
			<p className="text-sm text-gray-500 mt-2">30-Day Money-Back Guarantee</p>
			<input
				type="text"
				placeholder="Enter Coupon"
				className="mt-4 w-full p-2 border rounded"
			/>
			<button className="mt-2 w-full bg-purple-500 text-white py-2 rounded">
				Apply Coupon
			</button>
		</div>
	);
};

export default PricingCard;
