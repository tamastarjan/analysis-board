import { useContext } from "react";
import {
  BoardSelectionContext,
  ItemNode,
  updateBoard,
} from "../context/BoardsContext";
import { GraphNodeView } from "./GraphNodeView";

export function BoardView() {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);

  const addNoteCliked = () => {
    const nodeName = prompt("Enter your note:");
    if (!nodeName) {
      return;
    }

    selectedBoard.children.push(
      new ItemNode(nodeName, selectedBoard.id, selectedBoard.id)
    );
    const updatedBoard = updateBoard(selectedBoard);
    setSelectedBoard(updatedBoard);
  };

  return (
    <>
      {selectedBoard ? (
        <div className="board-view">
          <h1>{selectedBoard.name}</h1>
          <button onClick={addNoteCliked}>Add note</button>
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
