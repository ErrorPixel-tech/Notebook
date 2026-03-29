// ListCard.jsx
import { useDispatch } from "react-redux";
import { TaskItem } from "./TaskItem";
import { useEffect, useState } from "react";
import { deleteList, addTask } from "../app/slices/boardsSlice";

export const ListCard = ({ list }) => {
    const dispatch = useDispatch();

    // стартовое значение — считаем один раз
    const [secondsLeft, setSecondsLeft] = useState(() => {
        const now = Date.now();
        const diffMs = list.expiresAt - now;
        return diffMs > 0 ? Math.floor(diffMs / 1000) : 0;
    });

    useEffect(() => {
        if (secondsLeft <= 0) {
            // если уже истёк — просто удаляем и выходим
            dispatch(deleteList({ listId: list.id }));
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // удаляем, когда дошли до 0
                    dispatch(deleteList({ listId: list.id }));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        // важно: зависим от list.id и secondsLeft
    }, [dispatch, list.id, secondsLeft]);

    const formatTime = (seconds) => {
        if (seconds <= 0) return "0s";
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    const handleAddTask = () => {
        const text = prompt("Текст задачи:");
        if (!text) return;
        dispatch(addTask({ listId: list.id, text }));
    };
    const handleDeleteList = () => {
        dispatch(deleteList({ listId: list.id }));
    };

    return (
        <div className="list-card">
            <h3 className={
                "list-card__title" +
                (secondsLeft > 0 && secondsLeft < 86400
                    ? " list-card__title--danger"
                    : "")
            }>{list.title}</h3>
            <div className="list-card__timer">
                До удаления: {formatTime(secondsLeft)}
            </div>
            <ul className="list-card__tasks">
                {list.tasks.map((task) => (
                    <TaskItem key={task.id} task={task} listId={list.id} />
                ))}
            </ul>
            <button className="list-card__btn-add" onClick={handleAddTask}>
                Добавить задачу
            </button>
            <button className="list-card__btn-add" onClick={handleDeleteList}>
                Удалить список
            </button>
        </div>
    );
};
