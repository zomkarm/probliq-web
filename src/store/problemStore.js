import { create } from "zustand";

export const useProblemStore = create((set) => ({
  originalProblems: [],
  problems: [],

  problemSetMeta: {
    name: "",
  },

  setProblemSetMeta: (meta) =>
    set((state) => ({
      problemSetMeta: {
        ...state.problemSetMeta,
        ...meta,
      },
    })),

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