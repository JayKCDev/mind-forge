"use client";
import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/state/redux";
import { setLoggingOut, setRedirectingAfterLogout } from "@/state/authSlice";
import ChaptersSidebar from "./user/courses/[courseId]/ChaptersSidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [courseId, setCourseId] = useState<string | null>(null);
	const {
		user,
		isAuthenticated,
		isLoading,
		isLoggingOut,
		redirectingAfterLogout,
	} = useAuth();

	const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
		pathname,
	);

	useEffect(() => {
		if (isCoursePage) {
			const match = pathname.match(/\/user\/courses\/([^\/]+)/);
			setCourseId(match ? match[1] : null);
		} else {
			setCourseId(null);
		}
	}, [isCoursePage, pathname]);

	// Clean up logout states when component unmounts or when redirecting
	useEffect(() => {
		if (redirectingAfterLogout) {
			// Reset logout states after a short delay to allow redirect to complete
			const timer = setTimeout(() => {
				dispatch(setLoggingOut(false));
				dispatch(setRedirectingAfterLogout(false));
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [redirectingAfterLogout, dispatch]);

	// Show loading during logout or redirect to prevent flash of error message
	if (isLoading || isLoggingOut || redirectingAfterLogout) return <Loading />;

	// Only show the error message if we're not in the process of logging out
	if (!isAuthenticated || !user) {
		// If we're redirecting after logout, don't show the error message
		if (redirectingAfterLogout) {
			return <Loading />;
		}
		return <div>Please sign in to access this page.</div>;
	}

	return (
		<SidebarProvider>
			<div className="dashboard">
				<AppSidebar />
				<div className="dashboard__content">
					{courseId && <ChaptersSidebar />}
					<div
						className={cn(
							"dashboard__main",
							isCoursePage && "dashboard__main--not-course",
						)}
						style={{ height: "100vh" }}
					>
						<Navbar isCoursePage={isCoursePage} />
						<main className="dashboard__body">{children}</main>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
