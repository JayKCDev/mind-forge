import { Schema, model } from "dynamoose";

const userSchema = new Schema(
	{
		userId: {
			type: String,
			hashKey: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
			index: {
				name: "EmailIndex",
				type: "global",
			},
		},
		password: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		userType: {
			type: String,
			enum: ["student", "teacher"],
			default: "student",
			required: true,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		settings: {
			type: Object,
			default: {
				theme: "dark",
				emailAlerts: true,
				smsAlerts: false,
				courseNotifications: true,
				notificationFrequency: "immediate",
			},
		},
		paymentMethods: {
			type: Array,
			schema: [
				new Schema({
					methodId: String,
					type: String,
					lastFour: String,
					expiry: String,
				}),
			],
			default: [],
		},
		stripeCustomerId: {
			type: String,
		},
		bio: {
			type: String,
		},
		urls: {
			type: Array,
			schema: [String],
			default: [],
		},
		lastLogin: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const User = model("User", userSchema);
export default User;
