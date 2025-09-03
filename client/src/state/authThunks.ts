import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	setCredentials,
	logout,
	setLoading,
	setLoggingOut,
	setRedirectingAfterLogout,
	setError,
	clearError,
} from "./authSlice";
import { RootState } from "./redux";

// Login user
export const loginUser = createAsyncThunk(
	"auth/login",
	async (credentials: { email: string; password: string }, { dispatch }) => {
		try {
			dispatch(setLoading(true));
			dispatch(clearError());

			// Construct the signin URL
			const baseUrl =
				process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
			const signinUrl = `${baseUrl}/auth/signin`;

			const response = await fetch(signinUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(credentials),
			});

			const result = await response.json();

			if (response.ok) {
				// Store token in localStorage
				localStorage.setItem("authToken", result.data.token);

				// Update Redux state
				dispatch(
					setCredentials({
						user: result.data.user,
						token: result.data.token,
					}),
				);

				return result.data;
			} else {
				throw new Error(result.message || "Login failed");
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Login failed";
			dispatch(setError(errorMessage));
			throw error;
		} finally {
			dispatch(setLoading(false));
		}
	},
);

// Signup user
export const signupUser = createAsyncThunk(
	"auth/signup",
	async (
		userData: {
			firstName: string;
			lastName: string;
			email: string;
			password: string;
			userType: "student" | "teacher";
		},
		{ dispatch },
	) => {
		try {
			dispatch(setLoading(true));
			dispatch(clearError());

			// Construct the signup URL
			const baseUrl =
				process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
			const signupUrl = `${baseUrl}/auth/signup`;

			const response = await fetch(signupUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(userData),
			});

			const result = await response.json();

			if (response.ok) {
				// Store token in localStorage
				localStorage.setItem("authToken", result.data.token);

				// Update Redux state
				dispatch(
					setCredentials({
						user: result.data.user,
						token: result.data.token,
					}),
				);

				return result.data;
			} else {
				throw new Error(result.message || "Signup failed");
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Signup failed";
			dispatch(setError(errorMessage));
			throw error;
		} finally {
			dispatch(setLoading(false));
		}
	},
);

// Logout user
export const logoutUser = createAsyncThunk(
	"auth/logout",
	async (_, { dispatch, getState }) => {
		try {
			// Set logging out state to prevent flash of error message
			dispatch(setLoggingOut(true));
			dispatch(setRedirectingAfterLogout(true));

			const state = getState() as RootState;
			const token = state.auth.token || localStorage.getItem("authToken");

			// Call server logout endpoint if we have a token
			if (token) {
				// Construct the logout URL
				const baseUrl =
					process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
				const logoutUrl = `${baseUrl}/auth/logout`;

				const response = await fetch(logoutUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				// Even if server call fails, we still logout locally
				if (!response.ok) {
					console.warn(
						"Server logout failed, but proceeding with local logout",
					);
				}
			}

			// Clear local storage and Redux state
			localStorage.removeItem("authToken");
			dispatch(logout());
		} catch (error) {
			// Even if there's an error, we still logout locally
			console.error("Logout error:", error);
			localStorage.removeItem("authToken");
			dispatch(logout());
		}
		// Note: We don't reset isLoggingOut here to prevent the flash
		// It will be reset when the component unmounts or redirects
	},
);

// Verify token on app load
export const verifyToken = createAsyncThunk(
	"auth/verifyToken",
	async (_, { dispatch, getState }) => {
		const state = getState() as RootState;
		const token = state.auth.token || localStorage.getItem("authToken");

		if (!token) {
			dispatch(logout());
			return;
		}

		try {
			dispatch(setLoading(true));

			// Construct the profile URL
			const baseUrl =
				process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
			const profileUrl = `${baseUrl}/auth/profile`;

			const response = await fetch(profileUrl, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.ok) {
				const result = await response.json();
				dispatch(
					setCredentials({
						user: result.data.user,
						token: token,
					}),
				);
			} else {
				// Token invalid, logout
				localStorage.removeItem("authToken");
				dispatch(logout());
			}
		} catch (error) {
			localStorage.removeItem("authToken");
			dispatch(logout());
		} finally {
			dispatch(setLoading(false));
		}
	},
);
