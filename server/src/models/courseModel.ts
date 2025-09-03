import { Schema, model } from "dynamoose";

const commentSchema = new Schema({
  commentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const chapterSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Text", "Quiz", "Video"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    schema: [commentSchema],
  },
  video: {
    type: String,
  },
});

const sectionSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  sectionTitle: {
    type: String,
    required: true,
  },
  sectionDescription: {
    type: String,
  },
  chapters: {
    type: Array,
    schema: [chapterSchema],
  },
});

const courseSchema = new Schema(
	{
		courseId: {
			type: String,
			hashKey: true,
			required: true,
		},
		teacherId: {
			type: String,
			required: true,
		},
		teacherName: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			validate: (value: any) =>
				typeof value === "string" && value.length >= 50 && value.length <= 500,
		},
		shortDescription: {
			type: String,
			required: true,
			validate: (value: any) =>
				typeof value === "string" && value.length >= 10 && value.length <= 250,
		},
		category: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
		price: {
			type: Number,
		},
		level: {
			type: String,
			required: true,
			enum: ["Beginner", "Intermediate", "Advanced"],
		},
		status: {
			type: String,
			required: true,
			enum: ["Draft", "Published"],
		},
		sections: {
			type: Array,
			schema: [sectionSchema],
		},
		enrollments: {
			type: Array,
			schema: [
				new Schema({
					userId: {
						type: String,
						required: true,
					},
				}),
			],
		},
		whatYoullLearn: {
			type: Array,
			schema: [String],
			required: true,
			validate: (value) => Array.isArray(value) && value.length > 0,
		},
		requirements: {
			type: Array,
			schema: [String],
			required: true,
			validate: (value) => Array.isArray(value) && value.length > 0,
		},
	},
	{
		timestamps: true,
	}
);

const Course = model("Course", courseSchema);
export default Course;
