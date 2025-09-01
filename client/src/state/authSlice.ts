import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
	userId: string;
	email: string;
	firstName: string;
	lastName: string;
	userType: "student" | "teacher";
	isEmailVerified: boolean;
	lastLogin: string;
	createdAt: string;
	updatedAt: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ user: User; token: string }>
		) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
			state.error = null;
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			state.error = null;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.isLoading = false;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
});

export const { setCredentials, logout, setLoading, setError, clearError } =
	authSlice.actions;
export default authSlice.reducer;
