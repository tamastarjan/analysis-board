import { useContext } from "react";
import { BoardContext } from "../context/BoardsContext";
import { Board } from "../context/BoardsContext";

export function LeftSideBar() {
  const [context, setContext] = useContext(BoardContext);

  const newBoardClicked = () => {
    const boardName = prompt("Enter a name for the new board");
    if (boardName) {
      const newBoard = new Board(boardName);
      setContext((prevContext) => {
        return { ...prevContext, boards: [...prevContext.boards, newBoard] };
      });
    }
  };

  const deleteBoard = (boardIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this board?"
    );
    if (!confirmDelete) {
      return;
    }

    setContext((prevContext) => {
      const newBoards = [...prevContext.boards];
      newBoards.splice(boardIndex, 1);
      return { ...prevContext, boards: newBoards };
    });
  };

  const boardClicked = (board) => {
    setContext((prevContext) => {
      return { ...prevContext, selectedBoard: board };
    });
  };

  const boardDoubleClicked = (boardIndex, board) => {
    const boardName = prompt("Enter a new name for the board", board.name);
    if (boardName) {
      setContext((prevContext) => {
        const newBoards = [...prevContext.boards];
        newBoards[boardIndex].name = boardName;
        return { ...prevContext, boards: newBoards };
      });
    }
  };

  return (
    <div className="left-side-bar">
      <h1>Boards</h1>
      <button onClick={newBoardClicked}>New board</button>
      {context.boards.map((board, boardIndex) => (
        <div key={board.id} className="board">
          <div
            className="board-name"
            onClick={() => boardClicked(board)}
            onDoubleClick={() => boardDoubleClicked(boardIndex, board)}
          >
            {board.name}
          </div>
          <div className="board-delete">
            <button onClick={() => deleteBoard(boardIndex)}>X</button>
          </div>
        </div>
      ))}
    </div>
  );
}
