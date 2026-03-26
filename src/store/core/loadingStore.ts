import store from '@/store/core/coreStore';
import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
	loading: boolean;
	activeRequests: number;
}

const initialState: LoadingState = {
	loading: false,
	activeRequests: 0,
};

export const loadingStore = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		startLoading(state) {
			state.activeRequests += 1;
			state.loading = true;
		},
		stopLoading(state) {
			state.activeRequests = Math.max(0, state.activeRequests - 1);
			state.loading = state.activeRequests > 0;
		},
		resetLoading(state) {
			state.activeRequests = 0;
			state.loading = false;
		},
	},
});

export const { startLoading, stopLoading, resetLoading } = loadingStore.actions;
export default loadingStore.reducer;

export const dispatchSetLoading = (action: boolean): void => {
	const { dispatch } = store;

	if (action) {
		dispatch(startLoading());
	} else {
		// UX 자연스럽게 보이기 위해 살짝 딜레이
		setTimeout(() => {
			dispatch(stopLoading());
		}, 500);
	}
};
