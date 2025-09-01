import { useAppSelector, useAppDispatch } from "@/state/redux";
import { loginUser, signupUser, logoutUser } from "@/state/authThunks";

export const useAuth = () => {
	const dispatch = useAppDispatch();
	const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
		(state) => state.auth
	);

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

	const logout = () => {
		dispatch(logoutUser());
	};

	return {
		user,
		token,
		isAuthenticated,
		isLoading,
		error,
		login,
		signup,
		logout,
	};
};
