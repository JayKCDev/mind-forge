"use client";

import { Bell, BookOpen, User, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NonDashboardNavbar = () => {
	const { user, isAuthenticated, logout } = useAuth();
	const userRole = user?.userType as "student" | "teacher";

	return (
		<nav className="nondashboard-navbar">
			<div className="nondashboard-navbar__container">
				<div className="nondashboard-navbar__search">
					<Link href="/" className="nondashboard-navbar__brand" scroll={false}>
						Mind Forge
					</Link>
					<div className="flex items-center gap-4">
						<div className="relative group">
							<Link
								href="/search"
								className="nondashboard-navbar__search-input"
								scroll={false}
							>
								<span className="hidden sm:inline">Search Courses</span>
								<span className="sm:hidden">Search</span>
							</Link>
							<BookOpen
								className="nondashboard-navbar__search-icon"
								size={18}
							/>
						</div>
					</div>
				</div>
				<div className="nondashboard-navbar__actions">
					<button className="nondashboard-navbar__notification-button">
						<span className="nondashboard-navbar__notification-indicator"></span>
						<Bell className="nondashboard-navbar__notification-icon" />
					</button>

					{isAuthenticated && user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<Avatar className="h-8 w-8">
										<AvatarImage src="" alt={user?.firstName || "User"} />
										<AvatarFallback className="bg-customgreys-darkGrey text-white-100">
											{user?.firstName?.[0] || "U"}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56 bg-customgreys-primarybg border border-customgreys-darkGrey shadow-lg"
								align="end"
								forceMount
							>
								<DropdownMenuLabel className="font-normal text-white-100">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none text-white-100">
											{user?.firstName} {user?.lastName}
										</p>
										<p className="text-xs leading-none text-customgreys-dirtyGrey">
											{user?.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									asChild
									className="text-white-100 hover:bg-customgreys-secondarybg focus:bg-customgreys-secondarybg"
								>
									<Link
										href={
											userRole === "teacher"
												? "/teacher/profile"
												: "/user/profile"
										}
										className="cursor-pointer"
									>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator className="bg-customgreys-darkGrey" />
								<DropdownMenuItem
									onClick={logout}
									className="cursor-pointer text-white-100 hover:bg-customgreys-secondarybg focus:bg-customgreys-secondarybg"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<>
							<Link
								href="/signin"
								className="nondashboard-navbar__auth-button--login"
								scroll={false}
							>
								Log in
							</Link>
							<Link
								href="/signup"
								className="nondashboard-navbar__auth-button--signup"
								scroll={false}
							>
								Sign up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default NonDashboardNavbar;
