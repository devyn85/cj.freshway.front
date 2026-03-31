import { create } from 'zustand';

type Progress = { runId: number; value: number; total: number };

type ProgressStore = {
  progress: Progress | null;
  start: (runId: number, total: number) => void;
  report: (runId: number, value: number) => void;
  finish: (runId: number) => void;
  reset: () => void;
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: null,

  start: (runId, total) => {
    const curr = get().progress;
    // 최신 실행(runId) 우선
    if (!curr || runId >= curr.runId) {
      set({ progress: { runId, value: 0, total } });
    }
  },

  report: (runId, value) => {
    const curr = get().progress;
    if (!curr) return;
    // 오래된 실행 무시
    if (runId < curr.runId) return;
    // 최신 실행: 단조 증가 보장
    if (runId === curr.runId) {
      const nextValue = Math.max(curr.value, value);
      if (nextValue !== curr.value) {
        set({ progress: { runId, value: nextValue, total: curr.total } });
      }
      return;
    }
    // 더 최신 실행이 들어오면 교체
    set({ progress: { runId, value, total: curr.total } });
  },

  finish: (runId) => {
    const curr = get().progress;
    if (curr && curr.runId === runId) {
      set({ progress: null });
    }
  },

  reset: () => set({ progress: null }),
}));