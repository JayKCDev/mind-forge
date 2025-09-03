"use client";

import { Bell, BookOpen, User, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
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

const Navbar: React.FC<NavbarProps> = ({ isCoursePage, className = "" }) => {
	const { user, logout } = useAuth();
	const userRole = user?.userType as "student" | "teacher";

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<nav
			className={`dashboard-navbar ${className}`}
			role="navigation"
			aria-label="Main navigation"
		>
			<div className="dashboard-navbar__container">
				<div className="dashboard-navbar__search">
					<div className="md:hidden">
						<SidebarTrigger
							className="dashboard-navbar__sidebar-trigger"
							aria-label="Toggle sidebar menu"
						/>
					</div>

					<div className="flex items-center gap-4">
						<div className="relative group">
							<Link
								href="/search"
								className={cn("dashboard-navbar__search-input", {
									"!bg-customgreys-secondarybg": isCoursePage,
								})}
								scroll={false}
								aria-label="Search courses"
							>
								<span className="hidden sm:inline">Search Courses</span>
								<span className="sm:hidden">Search</span>
							</Link>
							<BookOpen
								className="dashboard-navbar__search-icon"
								size={18}
								aria-hidden="true"
							/>
						</div>
					</div>
				</div>

				<div className="dashboard-navbar__actions">
					<button
						className="nondashboard-navbar__notification-button"
						aria-label="View notifications"
						aria-describedby="notification-count"
					>
						<span
							id="notification-count"
							className="nondashboard-navbar__notification-indicator"
							aria-label="0 new notifications"
						></span>
						<Bell
							className="nondashboard-navbar__notification-icon"
							aria-hidden="true"
						/>
					</button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="relative h-8 w-8 rounded-full"
								aria-label={`Open user menu for ${user?.firstName || "User"}`}
							>
								<Avatar className="h-8 w-8">
									<AvatarImage
										src=""
										alt={`${user?.firstName || "User"}'s profile picture`}
									/>
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
									aria-label="View profile"
								>
									<User className="mr-2 h-4 w-4" aria-hidden="true" />
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-customgreys-darkGrey" />
							<DropdownMenuItem
								onClick={handleLogout}
								className="cursor-pointer text-white-100 hover:bg-customgreys-secondarybg focus:bg-customgreys-secondarybg"
								aria-label="Sign out of account"
							>
								<LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
