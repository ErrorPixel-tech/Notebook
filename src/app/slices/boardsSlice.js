import { createSlice } from "@reduxjs/toolkit";

const boardsSlice = createSlice({
    name: "boards",
    initialState: {
        lists: []
    },
    reducers: {
        addListWithTimer(state, action) {
            const { title, timeInSeconds } = action.payload;
            state.lists.push({
                id: crypto.randomUUID(),
                title,
                tasks: [],
                createdAt: Date.now(),
                expiresAt: (Date.now() + timeInSeconds * 1000),
                isExpired: false,
                isHidden: false,
                elapsedMs: 0,
                startedAt: null,
                isRunning: false
            });
        },
        addTask(state, action) {
            const { listId, text } = action.payload;
            const list = state.lists.find(l => l.id === listId);
            if (list) {
                list.tasks.push({
                    id: crypto.randomUUID(),
                    text,
                    done: false,
                    isHidden: false,
                });
            }
        },
        markListExpired(state, action) {
            console.log('expired');  // ок для дебага
            const { listId } = action.payload;

            state.lists = state.lists.map(list =>
                list.id === listId
                    ? {
                        ...list,
                        tasks: [],
                        title: list.title,
                        isExpired: true,
                    }
                    : list
            );
        },
        toggleListHidden: (state, action) => {
            const listId = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === listId);
            if (listIndex !== -1) {
                state.lists[listIndex].isHidden = !state.lists[listIndex].isHidden;
            }
        },
        showAllLists: (state) => {
            state.lists.forEach(list => {
                list.isHidden = false;
            });
        },
        hideOthersExcept: (state, action) => {
            const { targetId } = action.payload;
            state.lists = state.lists.map(list => ({
                ...list,
                isHidden: list.id !== targetId
            }));
        },
        hideOtherTasksInList: (state, action) => {
            const { listId, taskId } = action.payload;
            const list = state.lists.find(list => list.id === listId);
            if (list) {
                list.tasks.forEach(task => {
                    task.isHidden = task.id !== taskId;
                });
            }
        },
        showHiddenTasksInList: (state, action) => {
            const { listId } = action.payload;
            const list = state.lists.find(list => list.id === listId);
            if (list) {
                list.tasks.forEach(task => {
                    task.isHidden = false;
                });
            }
        },
        deleteList(state, action) {
            const { listId } = action.payload;
            state.lists = state.lists.filter(list => list.id !== listId);
        },
        toggleTask(state, action) {
            const { listId, taskId } = action.payload;
            const list = state.lists.find(l => l.id === listId);
            if (list) {
                const task = list.tasks.find(t => t.id === taskId);
                if (task) task.done = !task.done;
            }
        },
        deleteTask(state, action) {
            const { listId, taskId } = action.payload;
            const list = state.lists.find(l => l.id === listId);
            if (list) {
                list.tasks = list.tasks.filter(t => t.id !== taskId);
            }
        }, startTimer(state, action) {
            const list = state.lists.find(l => l.id === action.payload);
            if (!list || list.isRunning) return;
            list.startedAt = Date.now();
            list.isRunning = true;
        },

        pauseTimer(state, action) {
            const list = state.lists.find(l => l.id === action.payload);
            if (!list || !list.isRunning) return;
            list.elapsedMs += Date.now() - list.startedAt;
            list.startedAt = null;
            list.isRunning = false;
        },

        resetTimer(state, action) {
            const list = state.lists.find(l => l.id === action.payload);
            if (!list) return;
            list.elapsedMs = 0;
            list.startedAt = null;
            list.isRunning = false;
        },
    }
});

export const { addListWithTimer, startTimer, pauseTimer, resetTimer, hideOthersExcept, showHiddenTasksInList, hideOtherTasksInList, toggleListHidden, showAllLists, markListExpired, addTask, toggleTask, deleteTask, deleteList } = boardsSlice.actions;
export default boardsSlice.reducer;