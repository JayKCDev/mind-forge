"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { User, Shield } from "lucide-react";

const ClientProfileContent = () => {
	const { user, logout } = useAuth();

	if (!user) {
		return <div>Loading profile...</div>;
	}

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Personal Information
					</CardTitle>
					<CardDescription>
						Your account details and preferences
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input id="firstName" value={user.firstName || ""} readOnly />
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input id="lastName" value={user.lastName || ""} readOnly />
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" value={user.email || ""} readOnly />
					</div>
					<div className="space-y-2">
						<Label htmlFor="userType">Account Type</Label>
						<Input id="userType" value={user.userType || "student"} readOnly />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Account Security
					</CardTitle>
					<CardDescription>
						Manage your account security settings
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button onClick={logout} variant="destructive">
						Logout
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default ClientProfileContent;
