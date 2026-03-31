import { create } from 'zustand';

interface StateShape {
	temporaryOptimizeMapData: Map<string, any>;
}

export const useStore = create<StateShape>(() => ({
	temporaryOptimizeMapData: new Map(),
}));

export default useStore;
