import express from "express";
import multer from "multer";
import {
	createCourse,
	deleteCourse,
	getCourse,
	listCourses,
	updateCourse,
	getUploadVideoUrl,
	getUploadCoverPhotoUrl,
} from "../controllers/courseController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", listCourses);
router.post("/", authenticateToken, createCourse);

router.get("/:courseId", getCourse);
router.put(
	"/:courseId",
	authenticateToken,
	upload.single("image"),
	updateCourse
);
router.delete("/:courseId", authenticateToken, deleteCourse);

// Course-level upload URLs
router.post(
	"/:courseId/get-cover-photo-upload-url",
	authenticateToken,
	getUploadCoverPhotoUrl
);

router.post(
	"/:courseId/get-video-upload-url",
	authenticateToken,
	getUploadVideoUrl
);


export default router;
