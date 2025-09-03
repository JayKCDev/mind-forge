import { useAppSelector, useAppDispatch } from "@/state/redux";
import { loginUser, signupUser, logoutUser } from "@/state/authThunks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const {
		user,
		token,
		isAuthenticated,
		isLoading,
		isLoggingOut,
		redirectingAfterLogout,
		error,
	} = useAppSelector((state) => state.auth);

	const login = async (credentials: { email: string; password: string }) => {
		return await dispatch(loginUser(credentials)).unwrap();
	};

	const signup = async (userData: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		userType: "student" | "teacher";
	}) => {
		return await dispatch(signupUser(userData)).unwrap();
	};

	const logout = async () => {
		try {
			await dispatch(logoutUser());
			// Show success message
			toast.success("Logged out successfully!");
			// Redirect to home page after logout
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
			// Even if there's an error, try to redirect
			router.push("/");
		}
	};

	return {
		user,
		token,
		isAuthenticated,
		isLoading,
		isLoggingOut,
		redirectingAfterLogout,
		error,
		login,
		signup,
		logout,
	};
};
