import { StateCreator } from "zustand";

export interface PersistantHydrationSlice {
  hydrated: boolean;
}

export const createPersistantHydrationSlice = (): StateCreator<
  PersistantHydrationSlice,
  [],
  [],
  PersistantHydrationSlice
> => {
  return () => ({
    hydrated: false,
  });
};
