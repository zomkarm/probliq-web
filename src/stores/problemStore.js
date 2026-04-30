import { create } from "zustand";

export const useProblemStore = create((set) => ({
  // original dump (step 1)
  originalProblems: [],

  // current working set (step 2+)
  problems: [],

  setInitialProblems: (nodes) =>
    set({
      originalProblems: nodes,
      problems: nodes,
    }),

  setProblems: (nodes) => set({ problems: nodes }),

  restoreOriginal: () =>
    set((state) => ({
      problems: state.originalProblems,
    })),

  clearProblems: () => set({ problems: [] }),
}));