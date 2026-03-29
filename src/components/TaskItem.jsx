import { useDispatch } from "react-redux";

export const TaskItem = ({ task, listId }) => {
    const dispatch = useDispatch();

    const toggle = () => {
        dispatch(
            { type: "boards/toggleTask", payload: { listId, taskId: task.id } }
        );
    };

    const deleteTask = () => {
        dispatch(
            { type: "boards/deleteTask", payload: { listId, taskId: task.id } }
        );
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