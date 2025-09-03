import React from "react";

const HeroSection = () => {
	return (
		<div className="hero-section">
			<h1 className="text-3xl font-bold">Course Title</h1>
			<p className="text-lg">Instructor Name</p>
			<div className="flex items-center">
				<span className="text-yellow-500">★★★★☆</span>
				<span className="ml-2">4.5 (2000 ratings)</span>
			</div>
			<p className="text-sm text-gray-500">Last updated: January 2023</p>
			<p className="text-sm text-gray-500">1000 learners</p>
		</div>
	);
};

export default HeroSection;
