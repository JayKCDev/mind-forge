// Category and sub-category definitions
export const CATEGORIES = {
	Development: [
		"Data Science",
		"Web Development",
		"Mobile Development",
		"Programming Languages",
	],
	Business: [
		"Entrepreneurship",
		"Business Strategy",
		"Communication",
		"Business Law",
		"Business Analytics and Intelligence",
	],
	Design: [
		"Web Design",
		"Graphic Design and Illustration",
		"Design Tools",
		"Fashion Design",
	],
	Marketing: [
		"Digital Marketing",
		"Marketing Fundamentals",
		"Branding",
		"Product Marketing",
	],
} as const;

export type Category = keyof typeof CATEGORIES;
export type SubCategory = (typeof CATEGORIES)[Category][number];

// Validation functions
export const isValidCategory = (category: string): category is Category => {
	return category in CATEGORIES;
};

export const isValidSubCategory = (
	subCategory: string
): subCategory is SubCategory => {
	return Object.values(CATEGORIES)
		.flat()
		.includes(subCategory as SubCategory);
};

export const isSubCategoryValidForCategory = (
	category: string,
	subCategory: string
): boolean => {
	if (!isValidCategory(category)) return false;
	return (CATEGORIES[category as Category] as readonly string[]).includes(
		subCategory
	);
};

export const getSubCategoriesForCategory = (
	category: Category
): readonly SubCategory[] => {
	return CATEGORIES[category];
};
