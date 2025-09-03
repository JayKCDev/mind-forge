declare global {
	interface PaymentMethod {
		methodId: string;
		type: string;
		lastFour: string;
		expiry: string;
	}

	interface UserSettings {
		theme?: "light" | "dark";
		emailAlerts?: boolean;
		smsAlerts?: boolean;
		courseNotifications?: boolean;
		notificationFrequency?: "immediate" | "daily" | "weekly";
	}

	interface User {
		userId: string;
		firstName?: string;
		lastName?: string;
		username?: string;
		email: string;
		publicMetadata: {
			userType: "teacher" | "student";
		};
		privateMetadata: {
			settings?: UserSettings;
			paymentMethods?: Array<PaymentMethod>;
			defaultPaymentMethodId?: string;
			stripeCustomerId?: string;
		};
		unsafeMetadata: {
			bio?: string;
			urls?: string[];
		};
	}

	interface Course {
		courseId: string;
		teacherId: string;
		teacherName: string;
		title: string;
		description?: string;
		shortDescription?: string;
		category: string;
		image?: string;
		price?: number; // Stored in cents (e.g., 4999 for $49.99)
		level: "Beginner" | "Intermediate" | "Advanced";
		status: "Draft" | "Published";
		sections: Section[];
		enrollments?: Array<{
			userId: string;
		}>;
	}

	interface Transaction {
		userId: string;
		transactionId: string;
		dateTime: string;
		courseId: string;
		paymentProvider: "stripe";
		paymentMethodId?: string;
		amount: number; // Stored in cents
		savePaymentMethod?: boolean;
	}

	interface DateRange {
		from: string | undefined;
		to: string | undefined;
	}

	interface UserCourseProgress {
		userId: string;
		courseId: string;
		enrollmentDate: string;
		overallProgress: number;
		sections: SectionProgress[];
		lastAccessedTimestamp: string;
	}

	type CreateUserArgs = Omit<User, "userId">;
	type CreateCourseArgs = Omit<Course, "courseId">;
	type CreateTransactionArgs = Omit<Transaction, "transactionId">;

	// Component Props Types
	type CourseCardProps = {
		course: Course;
		onGoToCourse: (course: Course) => void;
		className?: string;
		showPrice?: boolean;
		showCategory?: boolean;
	};

	type TeacherCourseCardProps = {
		course: Course;
		onEdit: (course: Course) => void;
		onDelete: (course: Course) => void;
		isOwner: boolean;
	};

	type NavbarProps = {
		isCoursePage: boolean;
		className?: string;
	};

	type LoadingProps = {
		text?: string;
		size?: "sm" | "md" | "lg";
		className?: string;
		fullScreen?: boolean;
	};

	type CustomModalProps = {
		isOpen: boolean;
		onClose: () => void;
		children: React.ReactNode;
		title?: string;
		description?: string;
		size?: "sm" | "md" | "lg" | "xl";
	};

	type FormFieldProps = {
		name: string;
		label: string;
		type?:
			| "text"
			| "email"
			| "textarea"
			| "number"
			| "select"
			| "switch"
			| "password"
			| "file"
			| "multi-input";
		placeholder?: string;
		options?: { value: string; label: string }[];
		accept?: string;
		className?: string;
		labelClassName?: string;
		inputClassName?: string;
		value?: string;
		disabled?: boolean;
		multiple?: boolean;
		isIcon?: boolean;
		initialValue?: string | number | boolean | string[];
	};

	type MultiInputFieldProps = {
		name: string;
		control: any;
		placeholder?: string;
		inputClassName?: string;
	};

	type PasswordInputProps = {
		id: string;
		label: string;
		register: UseFormRegisterReturn;
		error?: string;
		placeholder?: string;
		className?: string;
		labelClassName?: string;
		inputClassName?: string;
		disabled?: boolean;
		required?: boolean;
	};

	type NavLink = {
		icon: React.ComponentType<{ className?: string }>;
		label: string;
		href: string;
	};

	type NavLinks = {
		student: NavLink[];
		teacher: NavLink[];
	};

	interface Comment {
		commentId: string;
		userId: string;
		text: string;
		timestamp: string;
	}

	interface Chapter {
		chapterId: string;
		title: string;
		content: string;
		video?: string | File;
		freePreview?: boolean;
		type: "Text" | "Quiz" | "Video";
	}

	interface ChapterProgress {
		chapterId: string;
		completed: boolean;
	}

	interface SectionProgress {
		sectionId: string;
		chapters: ChapterProgress[];
	}

	interface Section {
		sectionId: string;
		sectionTitle: string;
		sectionDescription?: string;
		chapters: Chapter[];
	}

	type WizardStepperProps = {
		currentStep: number;
	};

	type AccordionSectionsProps = {
		sections: Section[];
	};

	type SearchCourseCardProps = {
		course: Course;
		isSelected?: boolean;
		onClick?: () => void;
	};

	type CoursePreviewProps = {
		course: Course;
	};

	type CustomFixedModalProps = {
		isOpen: boolean;
		onClose: () => void;
		children: ReactNode;
	};

	type HeaderProps = {
		title: string;
		subtitle: string;
		rightElement?: ReactNode;
	};

	type SharedNotificationSettingsProps = {
		title?: string;
		subtitle?: string;
	};

	type SelectedCourseProps = {
		course: Course;
		handleEnrollNow: (courseId: string) => void;
	};

	type ToolbarProps = {
		onSearch: (search: string) => void;
		onCategoryChange: (category: string) => void;
	};

	type ChapterModalProps = {
		isOpen: boolean;
		onClose: () => void;
		sectionIndex: number | null;
		chapterIndex: number | null;
		sections: Section[];
		setSections: React.Dispatch<React.SetStateAction<Section[]>>;
		courseId: string;
	};

	type SectionModalProps = {
		isOpen: boolean;
		onClose: () => void;
		sectionIndex: number | null;
		sections: Section[];
		setSections: React.Dispatch<React.SetStateAction<Section[]>>;
	};

	type DroppableComponentProps = {
		sections: Section[];
		setSections: (sections: Section[]) => void;
		handleEditSection: (index: number) => void;
		handleDeleteSection: (index: number) => void;
		handleAddChapter: (sectionIndex: number) => void;
		handleEditChapter: (sectionIndex: number, chapterIndex: number) => void;
		handleDeleteChapter: (sectionIndex: number, chapterIndex: number) => void;
	};

	type CourseFormData = {
		courseTitle: string;
		teacherName: string;
		courseDescription: string;
		courseCategory: string;
		coursePrice: string;
		courseStatus: boolean;
	};

	// Hook Return Types
	type UsePasswordVisibilityReturn = {
		showPassword: boolean;
		togglePasswordVisibility: () => void;
		passwordType: "text" | "password";
	};

	type UseCarouselProps = {
		totalImages: number;
		interval?: number;
	};

	// State Types
	type AuthUser = {
		userId: string;
		email: string;
		firstName: string;
		lastName: string;
		userType: "student" | "teacher";
		isEmailVerified: boolean;
		lastLogin: string;
		createdAt: string;
		updatedAt: string;
	};

	type AuthState = {
		user: AuthUser | null;
		token: string | null;
		isAuthenticated: boolean;
		isLoading: boolean;
		isLoggingOut: boolean;
		redirectingAfterLogout: boolean;
		error: string | null;
	};

	type InitialStateTypes = {
		courseEditor: {
			sections: Section[];
			isChapterModalOpen: boolean;
			isSectionModalOpen: boolean;
			selectedSectionIndex: number | null;
			selectedChapterIndex: number | null;
		};
	};

	// UI Component Types
	type SidebarContext = {
		state: "expanded" | "collapsed";
		open: boolean;
		setOpen: (open: boolean) => void;
		openMobile: boolean;
		setOpenMobile: (open: boolean) => void;
		isMobile: boolean;
		toggleSidebar: () => void;
	};

	type FormFieldContextValue<
		TFieldValues extends FieldValues = FieldValues,
		TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	> = {
		name: TName;
	};

	type FormItemContextValue = {
		id: string;
	};
}

export {};
