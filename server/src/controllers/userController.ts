import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import User from "../models/userModel";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken, JwtPayload } from "../utils/jwt";

// Utility function to exclude password from user object
const excludePassword = (user: any) => {
	const { password, ...userWithoutPassword } = user;
	return userWithoutPassword;
};

export const signup = async (req: Request, res: Response): Promise<void> => {
	console.log(`userController.signup body: ${JSON.stringify(req.body)}`);
	try {
		const {
			email,
			password,
			firstName,
			lastName,
			userType = "student",
		} = req.body;

		// Validation: Check for required fields
		if (!email || !password || !firstName || !lastName) {
			res.status(400).json({
				message: "Email, password, first name, and last name are required",
			});
			return;
		}

		// Validation: Check email format
		if (!validator.isEmail(email)) {
			res.status(400).json({
				message: "Please provide a valid email address",
			});
			return;
		}

		// Validation: Check password strength
		if (password.length < 6) {
			res.status(400).json({
				message: "Password must be at least 6 characters long",
			});
			return;
		}

		// Validation: Check userType
		if (!["student", "teacher"].includes(userType)) {
			res.status(400).json({
				message: "User type must be either 'student' or 'teacher'",
			});
			return;
		}

		// Check if email already exists
		try {
			const existingUsers = await User.query("email")
				.eq(email)
				.using("EmailIndex")
				.exec();
			if (existingUsers.length > 0) {
				res.status(400).json({
					message: "Email already exists",
				});
				return;
			}
		} catch (error) {
			// If the query fails, it might be because the index doesn't exist yet
			// In that case, we'll proceed with user creation
			console.log("Email index query failed, proceeding with user creation");
		}

		// Hash the password
		const hashedPassword = await hashPassword(password);

		// Generate unique user ID
		const userId = uuidv4();

		// Create new user
		const newUser = new User({
			userId,
			email: email.toLowerCase(),
			password: hashedPassword,
			firstName,
			lastName,
			userType,
			isEmailVerified: false,
			lastLogin: new Date().toISOString(),
		});

		// Save user to database
		console.log(`userController.signup newUser: ${JSON.stringify(newUser)}`);
		const savedUser = await newUser.save();

		// Generate JWT token
		const tokenPayload: JwtPayload = {
			userId: (savedUser as any).userId,
			email: (savedUser as any).email,
			userType: (savedUser as any).userType,
		};
		const token = generateToken(tokenPayload);

		// Return success response with token and user data (excluding password)
		res.status(201).json({
			message: "User created successfully",
			data: {
				token,
				user: excludePassword(savedUser),
			},
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({
			message: "Internal server error during user registration",
			error: process.env.NODE_ENV === "development" ? error : undefined,
		});
	}
};

export const signin = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		// Validation: Check for required fields
		if (!email || !password) {
			res.status(400).json({
				message: "Email and password are required",
			});
			return;
		}

		// Validation: Check email format
		if (!validator.isEmail(email)) {
			res.status(400).json({
				message: "Please provide a valid email address",
			});
			return;
		}

		// Find user by email
		let user;
		try {
			const users = await User.query("email")
				.eq(email.toLowerCase())
				.using("EmailIndex")
				.exec();
			user = users.length > 0 ? users[0] : null;
		} catch (error) {
			// If email index doesn't work, fall back to scan (less efficient)
			const allUsers = await User.scan("email").eq(email.toLowerCase()).exec();
			user = allUsers.length > 0 ? allUsers[0] : null;
		}

		if (!user) {
			res.status(401).json({
				message: "Invalid email or password",
			});
			return;
		}

		// Verify password
		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			res.status(401).json({
				message: "Invalid email or password",
			});
			return;
		}

		// Update last login
		await User.update(
			{ userId: (user as any).userId },
			{ lastLogin: new Date().toISOString() }
		);

		// Generate JWT token
		const tokenPayload: JwtPayload = {
			userId: (user as any).userId,
			email: (user as any).email,
			userType: (user as any).userType,
		};
		const token = generateToken(tokenPayload);

		// Return success response
		res.status(200).json({
			message: "User signed in successfully",
			data: {
				token,
				user: excludePassword(user),
			},
		});
	} catch (error) {
		console.error("Signin error:", error);
		res.status(500).json({
			message: "Internal server error during sign in",
			error: process.env.NODE_ENV === "development" ? error : undefined,
		});
	}
};

export const getProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// User ID will be available from auth middleware
		const userId = (req as any).user?.userId;

		if (!userId) {
			res.status(401).json({
				message: "User not authenticated",
			});
			return;
		}

		// Get user from database
		const user = await User.get(userId);
		if (!user) {
			res.status(404).json({
				message: "User not found",
			});
			return;
		}

		// Return user profile (excluding password)
		res.status(200).json({
			message: "Profile retrieved successfully",
			data: {
				user: excludePassword(user),
			},
		});
	} catch (error) {
		console.error("Get profile error:", error);
		res.status(500).json({
			message: "Internal server error while retrieving profile",
			error: process.env.NODE_ENV === "development" ? error : undefined,
		});
	}
};

export const updateProfile = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId = (req as any).user?.userId;
		const { firstName, lastName, bio, urls, settings } = req.body;

		if (!userId) {
			res.status(401).json({
				message: "User not authenticated",
			});
			return;
		}

		// Prepare update data (only include provided fields)
		const updateData: any = {};
		if (firstName) updateData.firstName = firstName;
		if (lastName) updateData.lastName = lastName;
		if (bio !== undefined) updateData.bio = bio;
		if (urls !== undefined) updateData.urls = urls;
		if (settings !== undefined)
			updateData.settings = { ...updateData.settings, ...settings };

		// Update user
		const updatedUser = await User.update({ userId }, updateData, {
			returnValues: "ALL_NEW",
		});

		res.status(200).json({
			message: "Profile updated successfully",
			data: {
				user: excludePassword(updatedUser),
			},
		});
	} catch (error) {
		console.error("Update profile error:", error);
		res.status(500).json({
			message: "Internal server error while updating profile",
			error: process.env.NODE_ENV === "development" ? error : undefined,
		});
	}
};

export const updateUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { userId } = req.params;
	const userData = req.body;
	const authenticatedUserId = req.user?.userId;

	// Users can only update their own profile
	if (!authenticatedUserId || authenticatedUserId !== userId) {
		res.status(403).json({
			message: "Access denied. You can only update your own profile.",
		});
		return;
	}

	try {
		const user = await User.get(userId);
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		// Update user data
		Object.assign(user, userData);
		await user.save();

		res.json({ message: "User updated successfully", data: user });
	} catch (error) {
		res.status(500).json({ message: "Error updating user", error });
	}
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
	const { userId } = req.params;
	const authenticatedUserId = req.user?.userId;

	// Users can only view their own profile
	if (!authenticatedUserId || authenticatedUserId !== userId) {
		res
			.status(403)
			.json({ message: "Access denied. You can only view your own profile." });
		return;
	}

	try {
		const user = await User.get(userId);
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.json({ message: "User retrieved successfully", data: user });
	} catch (error) {
		res.status(500).json({ message: "Error retrieving user", error });
	}
};

export const logout = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = (req as any).user?.userId;

		if (!userId) {
			res.status(401).json({
				message: "User not authenticated",
			});
			return;
		}

		// Simple logout - just acknowledge the request
		// Client will handle removing the token from storage
		res.status(200).json({
			message: "User logged out successfully",
		});
	} catch (error) {
		console.error("Logout error:", error);
		res.status(500).json({
			message: "Internal server error during logout",
			error: process.env.NODE_ENV === "development" ? error : undefined,
		});
	}
};
