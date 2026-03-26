import { create } from 'zustand';

type FC = { type: 'FeatureCollection'; features: any[] };
type ListenerSource = { sido: FC; sgg: FC; dem: FC };

interface DistrictBoundaryState {
	listenerSource: ListenerSource;
	updatedAt?: string;
	setAll: (src: Partial<ListenerSource>) => void;
	clear: () => void;
}

const emptyFC: FC = { type: 'FeatureCollection', features: [] };

export const useDistrictBoundaryStore = create<DistrictBoundaryState>(set => ({
	listenerSource: { sido: emptyFC, sgg: emptyFC, dem: emptyFC },
	updatedAt: undefined,
	setAll: src =>
		set(state => ({
			listenerSource: { ...state.listenerSource, ...src },
			updatedAt: new Date().toISOString(),
		})),
	clear: () => set({ listenerSource: { sido: emptyFC, sgg: emptyFC, dem: emptyFC }, updatedAt: undefined }),
}));
