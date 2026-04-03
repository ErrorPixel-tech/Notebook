// ListCard.jsx
import { useDispatch } from "react-redux";
import { TaskItem } from "./TaskItem";
import { useEffect, useState } from "react";
import { deleteList, addTask, toggleListHidden, showHiddenTasksInList, hideOthersExcept, markListExpired } from "../app/slices/boardsSlice";

export const ListCard = ({ list }) => {
    const dispatch = useDispatch();



    // стартовое значение — считаем один раз
    const [secondsLeft, setSecondsLeft] = useState(() => {
        const now = Date.now();
        const diffMs = list.expiresAt - now;
        return diffMs > 0 ? Math.floor(diffMs / 1000) : 0;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, []);  // пустые! тикает всегда

    useEffect(() => {
        const checkExpired = () => {
            if (Date.now() > list.expiresAt && !list.isExpired) {
                dispatch(markListExpired({ listId: list.id }));
            }
        };

        const interval = setInterval(checkExpired, 1000);
        return () => clearInterval(interval);
    }, [dispatch, list.id, list.expiresAt, list.isExpired]);

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
        const isConfirmed = confirm("Вы уверены, что хотите удалить список?");
        if (isConfirmed) {
            dispatch(deleteList({ listId: list.id }));
        } else {
            ;
        }

    };

    const ONE_HOUR = 60 * 60;  // 24 часа в секундах
    const TWOO_HOURS = 60 * 60 * 2;  // 24 часа в секундах
    const ONE_DAY = 86400;  // 24 часа в секундах
    const TWO_DAYS = 172800; // 48 часов


    const getTitleClass = (secondsLeft) => {
        if (secondsLeft < ONE_DAY) {
            return "list-card__title--danger-red";
        }
        if (secondsLeft < ONE_DAY * 2) {
            return "list-card__title--danger-yellow";
        }
        if (secondsLeft < ONE_DAY * 7) {
            return "list-card__title--danger-black";
        }
        return "";  // >7 дней
    };
    const titleClass = getTitleClass(secondsLeft);

    // useEffect(() => {
    //     const title = list.title;
    //     console.log("debug:", { title, secondsLeft, titleClass });
    // }, [list.title, secondsLeft, titleClass]);


    const hiddenCount = list?.tasks.filter(t => t.isHidden).length || 0;

    let cardContent;

    if (list.isHidden) {
        return (
            <div className="list-card list-card--hidden">
                <h3>{list.title} (скрыт)</h3>
            </div>
        );
    }

    if (list.isExpired) {
        cardContent = (
            <div className="list-card">
                <h3 className={"list-card__title" + " " + titleClass}>{list.title.toUpperCase()} - ВРЕМЯ ВЫШЛО</h3>
                <button className="list-card__btn-add" onClick={handleDeleteList}>
                    Удалить список
                </button>
            </div>
        );
    } else {
        cardContent = (
            <div className="list-card">
                <h3 className={"list-card__title" + " " + titleClass}>{list.title}</h3>
                {hiddenCount > 0 && (
                    <button onClick={() => dispatch(showHiddenTasksInList({ listId: list.id }))}>
                        Показать все скрытые
                    </button>
                )}
                <div className="list-card__timer">
                    До удаления: {formatTime(secondsLeft)}
                </div>
                <ul className="list-card__tasks">
                    {list.tasks.map((task) => (
                        <TaskItem key={task.id} task={task} listId={list.id} />
                    ))}
                </ul>
                <div className="list-card__buttons">
                    <button className="list-card__btn-add" onClick={handleAddTask}>
                        Добавить задачу
                    </button>
                    <button
                        className="list-card__btn-add list-card__btn-hide"
                        onClick={() => dispatch(toggleListHidden(list.id))}
                    >
                        Скрыть
                    </button>
                    <button
                        className="list-card__btn-add list-card__btn-hide"
                        onClick={() => dispatch(hideOthersExcept({ targetId: list.id }))}
                    >
                        Скрыть всё остальное
                    </button>
                    <button className="list-card__btn-add" onClick={handleDeleteList}>
                        Удалить список
                    </button>
                </div>
            </div>
        );
    }

    return cardContent;
};
