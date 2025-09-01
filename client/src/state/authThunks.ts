import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	setCredentials,
	logout,
	setLoading,
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

			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
				}/auth/signin`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(credentials),
				}
			);

			const result = await response.json();

			if (response.ok) {
				// Store token in localStorage
				localStorage.setItem("authToken", result.data.token);

				// Update Redux state
				dispatch(
					setCredentials({
						user: result.data.user,
						token: result.data.token,
					})
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
	}
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
		{ dispatch }
	) => {
		try {
			dispatch(setLoading(true));
			dispatch(clearError());

			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
				}/auth/signup`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(userData),
				}
			);

			const result = await response.json();

			if (response.ok) {
				// Store token in localStorage
				localStorage.setItem("authToken", result.data.token);

				// Update Redux state
				dispatch(
					setCredentials({
						user: result.data.user,
						token: result.data.token,
					})
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
	}
);

// Logout user
export const logoutUser = createAsyncThunk(
	"auth/logout",
	async (_, { dispatch }) => {
		localStorage.removeItem("authToken");
		dispatch(logout());
	}
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

			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
				}/auth/profile`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (response.ok) {
				const result = await response.json();
				dispatch(
					setCredentials({
						user: result.data.user,
						token: token,
					})
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
	}
);
