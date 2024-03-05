import { useContext, useEffect, useState } from "react";
import {
  BoardSelectionContext,
  addBoard,
  deleteBoard,
  getBoard,
  getBoards,
  updateBoard,
} from "../context/BoardsContext";

export function LeftSideBar() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);

  useEffect(() => {
    const boards = getBoards();
    setBoards(boards);
  }, []);

  const newBoardClicked = () => {
    const boardName = prompt("Enter a name for the new board");
    if (boardName) {
      addBoard(boardName);
      setBoards(getBoards());
    }
  };

  const deleteBoardClicked = (boardIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this board?"
    );
    if (!confirmDelete) {
      return;
    }
    if (boardIndex >= boards.length) {
      return alert("Board not found");
    }

    const boardId = boards[boardIndex].id;
    deleteBoard(boardId);

    if (selectedBoard && boardId === selectedBoard.id) {
      setSelectedBoard(null);
    }
    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      newBoards.splice(boardIndex, 1);
      return newBoards;
    });
  };

  const boardClicked = (board) => {
    setSelectedBoard(getBoard(board.id));
  };

  const boardDoubleClicked = (boardIndex, board) => {
    const boardName = prompt("Enter a new name for the board", board.name);
    if (boardName) {
      board.name = boardName;
      updateBoard(boards);
      setBoards((prevBoards) => {
        const newBoards = [...prevBoards];
        newBoards[boardIndex] = board;
        return newBoards;
      });
    }
  };

  return (
    <div className="left-side-bar">
      <h1>Boards</h1>
      <button onClick={newBoardClicked}>New board</button>
      {boards.map((board, boardIndex) => (
        <div key={board.id} className="board">
          <div
            className="board-name"
            onClick={() => boardClicked(board)}
            onDoubleClick={() => boardDoubleClicked(boardIndex, board)}
          >
            {board.name}
          </div>
          <div className="board-delete">
            <button onClick={() => deleteBoardClicked(boardIndex)}>X</button>
          </div>
        </div>
      ))}
    </div>
  );
}
