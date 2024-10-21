// GlobalState.ts
import { StoreApi, UseBoundStore, create as zustandCreate, useStore as zustandUseStore } from "zustand";

export type GlobalState<A> = UseBoundStore<StoreApi<A>>;

export namespace GlobalState {
  export type Store<State> = StoreApi<State>;

  export const create = zustandCreate;
  export const useStore = zustandUseStore;
}

export default GlobalState;
