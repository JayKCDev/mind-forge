import express from "express";
import multer from "multer";
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  updateCourse,
  getUploadVideoUrl,
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

router.post(
	"/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url",
	authenticateToken,
	getUploadVideoUrl
);

export default router;
