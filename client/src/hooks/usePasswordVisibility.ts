import { useState } from "react";

export const usePasswordVisibility = (): UsePasswordVisibilityReturn => {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return {
		showPassword,
		togglePasswordVisibility,
		passwordType: showPassword ? "text" : "password",
	};
};
