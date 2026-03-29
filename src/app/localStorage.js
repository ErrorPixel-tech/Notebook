const STORAGE_KEY = "boardsState";

export const loadBoardsState = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined; // пусть Redux сам возьмёт initialState
    return JSON.parse(serialized);
  } catch (e) {
    console.error("loadBoardsState error", e);
    return undefined;
  }
};

export const saveBoardsState = (state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.error("saveBoardsState error", e);
  }
};