import { useDispatch, useSelector } from "react-redux";
import { ListCard } from "./ListCard";

export const BoardLists = () => {
    const dispatch = useDispatch();
    const lists = useSelector((state) => state.boards.lists);

    const addListWithTimer = (timeInSeconds) => {
        const title = prompt("Название списка:");
        if (title) {
            dispatch({ type: "boards/addListWithTimer", payload: { title, timeInSeconds } });
        }
    };

    // TODO убрать date now
    const calculateSecondsLeft = (list) => {
        const now = Date.now();
        const expiresAt = list.expiresAt;  // timestamp в ms
        return Math.max(0, Math.floor((expiresAt - now) / 1000));  // секунды, минимум 0
    };

    // // В компоненте, где рендерите списки (например, в useMemo или перед map)
    // const sortedLists = lists
    //     .filter(list => !list.isExpired)  // Опционально: исключить истекшие
    //     .sort((a, b) => {
    //         const secondsA = calculateSecondsLeft(a);  // Ваша функция formatTime использует secondsLeft
    //         const secondsB = calculateSecondsLeft(b);
    //         return secondsA - secondsB;  // Восходящий порядок (скоро истекающие первыми)
    //     });
    // В компоненте, где рендерите списки (например, в useMemo или перед map)
    const sortedLists = lists
        .filter(list => list)  // TODO УБРАТЬ ВСРАТУЮ СТРОКУ
        .sort((a, b) => {
            const secondsA = calculateSecondsLeft(a);  // Ваша функция formatTime использует secondsLeft
            const secondsB = calculateSecondsLeft(b);
            return secondsA - secondsB;  // Восходящий порядок (скоро истекающие первыми)
        });

    return (
        <div className="board">
            <div className="board__controls">
                <button className="board__btn-add"
                    onClick={() => addListWithTimer(3)}>
                    3 секунды
                </button>
                <button className="board__btn-add"
                    onClick={() => addListWithTimer(60 * 60 * 1)}>
                    1 час
                </button>
                <button className="board__btn-add"
                    onClick={() => addListWithTimer(60 * 60 * 2)}>
                    2 часа
                </button>
                <button className="board__btn-add"
                    onClick={() => addListWithTimer(60 * 60 * 24)}>
                    1 день
                </button>
                <button className="board__btn-add"
                    onClick={() => addListWithTimer(60 * 60 * 24 * 2)}>
                    2 дня
                </button>
                <button className="board__btn-add"
                    onClick={() => addListWithTimer(60 * 60 * 24 * 7)}>
                    1 неделя
                </button>
                <button className="board__btn-add"
                    onClick={() => addListWithTimer(60 * 60 * 24 * 14)}>
                    2 недели
                </button>
            </div>
            <div className="board__lists">
                {sortedLists.map((list) => (
                    <ListCard key={list.id} list={list} />
                ))}
                {/* {lists.map((list) => (
                    <ListCard key={list.id} list={list} />
                ))} */}
            </div>
        </div>
    );
};