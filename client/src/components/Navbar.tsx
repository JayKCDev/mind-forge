"use client";

import { Bell, BookOpen, User, LogOut } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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

const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
	const { user, logout } = useAuth();
	const userRole = user?.userType as "student" | "teacher";

	return (
		<nav className="dashboard-navbar">
			<div className="dashboard-navbar__container">
				<div className="dashboard-navbar__search">
					<div className="md:hidden">
						<SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
					</div>

					<div className="flex items-center gap-4">
						<div className="relative group">
							<Link
								href="/search"
								className={cn("dashboard-navbar__search-input", {
									"!bg-customgreys-secondarybg": isCoursePage,
								})}
								scroll={false}
							>
								<span className="hidden sm:inline">Search Courses</span>
								<span className="sm:hidden">Search</span>
							</Link>
							<BookOpen className="dashboard-navbar__search-icon" size={18} />
						</div>
					</div>
				</div>

				<div className="dashboard-navbar__actions">
					<button className="nondashboard-navbar__notification-button">
						<span className="nondashboard-navbar__notification-indicator"></span>
						<Bell className="nondashboard-navbar__notification-icon" />
					</button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
