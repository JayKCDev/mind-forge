import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,
	isLoggingOut: false,
	redirectingAfterLogout: false,
	error: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ user: AuthUser; token: string }>,
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
			state.isLoggingOut = false;
			state.redirectingAfterLogout = false;
			state.error = null;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setLoggingOut: (state, action: PayloadAction<boolean>) => {
			state.isLoggingOut = action.payload;
		},
		setRedirectingAfterLogout: (state, action: PayloadAction<boolean>) => {
			state.redirectingAfterLogout = action.payload;
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

export const {
	setCredentials,
	logout,
	setLoading,
	setLoggingOut,
	setRedirectingAfterLogout,
	setError,
	clearError,
} = authSlice.actions;
export default authSlice.reducer;
