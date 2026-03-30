import { useDispatch } from "react-redux";

export const TaskItem = ({ task, listId }) => {
    const dispatch = useDispatch();

    const toggle = () => {
        dispatch(
            { type: "boards/toggleTask", payload: { listId, taskId: task.id } }
        );
    };

    const deleteTask = () => {
        const isConfirmed = confirm("Вы уверены, что хотите удалить задачу?");
        if (isConfirmed) {
            dispatch(
                { type: "boards/deleteTask", payload: { listId, taskId: task.id } }
            ); 
        } else {
            ;
        }

    };

    return (
        <li className="task-item">
            <input
                type="checkbox"
                checked={task.done}
                onChange={toggle}
            />
            <span className={task.done ? "task-done" : ""}>
                {task.text}
            </span>
            <button onClick={deleteTask}>x</button>
        </li>
    );
};