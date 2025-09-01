import jwt from "jsonwebtoken";

const JWT_SECRET: string =
	process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
	userId: string;
	email: string;
	userType: "student" | "teacher";
}

export const generateToken = (payload: JwtPayload): string => {
	// @ts-ignore - Bypassing JWT type issues
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
};

export const verifyToken = (token: string): JwtPayload => {
	try {
		// @ts-ignore - Bypassing JWT type issues
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		return decoded;
	} catch (error) {
		throw new Error("Invalid or expired token");
	}
};

export const decodeToken = (token: string): JwtPayload | null => {
	try {
		// @ts-ignore - Bypassing JWT type issues
		const decoded = jwt.decode(token) as JwtPayload;
		return decoded;
	} catch (error) {
		return null;
	}
};
