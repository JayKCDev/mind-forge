import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SearchState = {
	filters: {
		ratings: "",
		level: [],
		price: [],
	},
	sortBy: "most-popular",
	view: "list",
	searchQuery: "",
};

export const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		// Filter actions
		setRatingFilter: (state, action: PayloadAction<string>) => {
			state.filters.ratings = action.payload;
		},

		setLevelFilter: (state, action: PayloadAction<string[]>) => {
			state.filters.level = action.payload;
		},

		setPriceFilter: (state, action: PayloadAction<string[]>) => {
			state.filters.price = action.payload;
		},

		updateFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
			state.filters = { ...state.filters, ...action.payload };
		},

		clearFilters: (state) => {
			state.filters = {
				ratings: "",
				level: [],
				price: [],
			};
		},

		// Sort actions
		setSortBy: (state, action: PayloadAction<string>) => {
			state.sortBy = action.payload;
		},

		// View actions
		setView: (state, action: PayloadAction<"grid" | "list">) => {
			state.view = action.payload;
		},

		// Search query actions
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
		},

		// Reset all search state
		resetSearchState: (state) => {
			state.filters = initialState.filters;
			state.sortBy = initialState.sortBy;
			state.view = initialState.view;
			state.searchQuery = initialState.searchQuery;
		},
	},
});

export const {
	setRatingFilter,
	setLevelFilter,
	setPriceFilter,
	updateFilters,
	clearFilters,
	setSortBy,
	setView,
	setSearchQuery,
	resetSearchState,
} = searchSlice.actions;

export default searchSlice.reducer;
