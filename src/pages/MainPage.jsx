import { BoardLists } from "../components/BoardLists";

export const MainPage = () => {
  return (
    <div className="main-page">
      <h1>Список списков дел</h1>
      <BoardLists />
    </div>
  );
};