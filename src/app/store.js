import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "./slices/boardsSlice";
import { loadBoardsState, saveBoardsState } from "./localStorage";

const preloadedState = {
  boards: loadBoardsState() || { lists: [] },
};

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
  },
  preloadedState,
});

// Подписка: при каждом изменении стора сохраняем boards в localStorage
store.subscribe(() => {
  const state = store.getState();
  saveBoardsState(state.boards);
});