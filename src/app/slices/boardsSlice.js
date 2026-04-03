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
                isHidden: false
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
        }
    }
});

export const { addListWithTimer, hideOthersExcept, showHiddenTasksInList, hideOtherTasksInList, toggleListHidden, showAllLists, markListExpired, addTask, toggleTask, deleteTask, deleteList } = boardsSlice.actions;
export default boardsSlice.reducer;