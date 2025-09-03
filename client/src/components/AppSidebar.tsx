import { usePathname } from "next/navigation";
import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	BookOpen,
	Briefcase,
	DollarSign,
	LogOut,
	PanelLeft,
	Settings,
	User,
} from "lucide-react";
import Loading from "./Loading";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const AppSidebar: React.FC = () => {
	const { user, isLoading, logout } = useAuth();
	const pathname = usePathname();
	const { toggleSidebar } = useSidebar();

	const navLinks: NavLinks = {
		student: [
			{ icon: BookOpen, label: "Courses", href: "/user/courses" },
			{ icon: Briefcase, label: "Billing", href: "/user/billing" },
			{ icon: User, label: "Profile", href: "/user/profile" },
			{ icon: Settings, label: "Settings", href: "/user/settings" },
		],
		teacher: [
			{ icon: BookOpen, label: "Courses", href: "/teacher/courses" },
			{ icon: DollarSign, label: "Billing", href: "/teacher/billing" },
			{ icon: User, label: "Profile", href: "/teacher/profile" },
			{ icon: Settings, label: "Settings", href: "/teacher/settings" },
		],
	};

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	if (isLoading) return <Loading fullScreen />;
	if (!user) return <div role="alert">User not found</div>;

	const userType = user.userType || "student";
	const currentNavLinks = navLinks[userType];

	return (
		<Sidebar
			collapsible="icon"
			style={{ height: "100vh" }}
			className="bg-customgreys-primarybg border-none shadow-lg"
			role="navigation"
			aria-label="Main sidebar navigation"
		>
			<SidebarHeader>
				<SidebarMenu className="app-sidebar__menu">
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							onClick={() => toggleSidebar()}
							className="group hover:bg-customgreys-secondarybg"
							aria-label="Toggle sidebar"
						>
							<div className="app-sidebar__logo-container group">
								<div className="app-sidebar__logo-wrapper">
									<Image
										src="/logo.svg"
										alt="Mind Forge logo"
										width={25}
										height={20}
										className="app-sidebar__logo"
									/>
									<p className="app-sidebar__title">Mind Forge</p>
								</div>
								<PanelLeft
									className="app-sidebar__collapse-icon"
									aria-hidden="true"
								/>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu className="app-sidebar__nav-menu">
					{currentNavLinks.map((link) => {
						const isActive = pathname.startsWith(link.href);
						const IconComponent = link.icon;

						return (
							<SidebarMenuItem
								key={link.href}
								className={cn(
									"app-sidebar__nav-item",
									isActive && "bg-gray-800",
								)}
							>
								<SidebarMenuButton
									asChild
									size="lg"
									className={cn(
										"app-sidebar__nav-button",
										!isActive && "text-customgreys-dirtyGrey",
									)}
								>
									<Link
										href={link.href}
										className="app-sidebar__nav-link"
										scroll={false}
										aria-current={isActive ? "page" : undefined}
										aria-label={`Navigate to ${link.label}`}
									>
										<IconComponent
											className={isActive ? "text-white-50" : "text-gray-500"}
											aria-hidden="true"
										/>
										<span
											className={cn(
												"app-sidebar__nav-text",
												isActive ? "text-white-50" : "text-gray-500",
											)}
										>
											{link.label}
										</span>
									</Link>
								</SidebarMenuButton>
								{isActive && (
									<div
										className="app-sidebar__active-indicator"
										aria-hidden="true"
									/>
								)}
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<button
								onClick={handleLogout}
								className="app-sidebar__signout"
								aria-label="Logout from account"
							>
								<LogOut className="mr-2 h-6 w-6" aria-hidden="true" />
								<span>Logout</span>
							</button>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
