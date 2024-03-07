import { useContext } from "react";
import {
  BoardSelectionContext,
  ItemNode,
  updateBoard,
} from "../context/BoardsContext";
import { GraphNodeView } from "./GraphNodeView";

export function BoardView() {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);

  const boardClicked = () => {
    const nodeName = prompt("Enter a name for the new category");
    if (!nodeName) {
      return;
    }

    selectedBoard.children.push(new ItemNode(nodeName));
    const updatedBoard = updateBoard(selectedBoard);
    setSelectedBoard(updatedBoard);
  };

  return (
    <>
      {selectedBoard ? (
        <div className="board-view">
          <button onClick={boardClicked}>{selectedBoard.name}</button>
          <br />
          <br />
          {selectedBoard.children.map((child) => {
            return <GraphNodeView key={child.id} node={child} />;
          })}
        </div>
      ) : (
        <div className="board-view">No board selected</div>
      )}
    </>
  );
}
