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
                isExpired: false
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
                        title: `${list.title.toUpperCase()} - ВРЕМЯ ВЫШЛО`,
                        isExpired: true,
                    }
                    : list
            );
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

export const { addListWithTimer, markListExpired, addTask, toggleTask, deleteTask, deleteList } = boardsSlice.actions;
export default boardsSlice.reducer;