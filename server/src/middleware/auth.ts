import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

// Extend Request interface to include user
declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(" ")[1]; // Bearer <TOKEN>

		if (!token) {
			res.status(401).json({
				message: "Access token is required",
			});
			return;
		}

		// Verify token
		const decoded = verifyToken(token);
		req.user = decoded;

		next();
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(403).json({
			message: "Invalid or expired token",
		});
		return;
	}
};

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(" ")[1];

		if (token) {
			try {
				const decoded = verifyToken(token);
				req.user = decoded;
			} catch (error) {
				// Token is invalid, but we continue without user
				console.log("Invalid token in optional auth, continuing without user");
			}
		}

		next();
	} catch (error) {
		// Continue without authentication
		next();
	}
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				message: "Authentication required",
			});
			return;
		}

		const allowedRoles = Array.isArray(roles) ? roles : [roles];

		if (!allowedRoles.includes(req.user.userType)) {
			res.status(403).json({
				message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
			});
			return;
		}

		next();
	};
};

// Middleware to ensure user can only access their own resources
export const requireOwnership = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (!req.user) {
		res.status(401).json({
			message: "Authentication required",
		});
		return;
	}

	const { userId } = req.params;

	if (req.user.userId !== userId) {
		res.status(403).json({
			message: "Access denied. You can only access your own resources",
		});
		return;
	}

	next();
};
