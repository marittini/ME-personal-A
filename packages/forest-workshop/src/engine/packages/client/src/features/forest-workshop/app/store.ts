// A tiny observable store: one state object, replaced on every change, with listeners that re-render. Screens read
// it; only the controller writes it.

export interface Store<S> {
  get(): S;
  set(update: Partial<S> | ((state: S) => Partial<S>)): void;
  /**
   * Records a value the screen already shows without re-rendering: text the player is typing. Re-rendering a field
   * while it is being typed in would break IME composition (Korean input) and move the caret.
   */
  remember(update: Partial<S> | ((state: S) => Partial<S>)): void;
  subscribe(listener: (state: S) => void): () => void;
}

export function createStore<S extends object>(initial: S): Store<S> {
  let state = initial;
  const listeners = new Set<(state: S) => void>();
  return {
    get: () => state,
    set(update) {
      const patch = typeof update === "function" ? update(state) : update;
      state = { ...state, ...patch };
      for (const listener of listeners) listener(state);
    },
    remember(update) {
      const patch = typeof update === "function" ? update(state) : update;
      state = { ...state, ...patch };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
