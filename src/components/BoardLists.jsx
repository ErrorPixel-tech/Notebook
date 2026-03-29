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

    return (
        <div className="board">
            <div className="board__controls">
                <button className="board__btn-add"
                    onClick={()=>addListWithTimer(2)}>
                    Добавить список на 2 секунды
                </button>
                <button className="board__btn-add"
                    onClick={()=>addListWithTimer(60*60*24)}>
                    Добавить список на 1 день
                </button>
                <button className="board__btn-add"
                    onClick={()=>addListWithTimer(60*60*24*2)}>
                    Добавить список на 2 дня
                </button>
                <button className="board__btn-add"
                    onClick={()=>addListWithTimer(60*60*24*7)}>
                    Добавить список на неделю
                </button>
            </div>
            <div className="board__lists">
                {lists.map((list) => (
                    <ListCard key={list.id} list={list} />
                ))}
            </div>
        </div>
    );
};