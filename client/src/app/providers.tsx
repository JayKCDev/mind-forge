"use client";

import React, { useEffect } from "react";
import StoreProvider from "@/state/redux";
import { useAppDispatch } from "@/state/redux";
import { verifyToken } from "@/state/authThunks";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		// Verify token on app load
		dispatch(verifyToken());
	}, [dispatch]);

	return <>{children}</>;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<StoreProvider>
			<AuthInitializer>{children}</AuthInitializer>
		</StoreProvider>
	);
};

export default Providers;
