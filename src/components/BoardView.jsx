import { useContext } from "react";
import {
  BoardSelectionContext,
  ItemNode,
  updateBoard,
} from "../context/BoardsContext";
import { GraphNodeView } from "./GraphNodeView";

export function BoardView() {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);

  const addNoteClicked = () => {
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
          <div className="board-view-title">
            <h1>{selectedBoard.name}</h1>
          </div>
          <div className="board-view-content">
            <div className="graph-children">
              {selectedBoard.children.map((child) => {
                return <GraphNodeView key={child.id} node={child} />;
              })}
            </div>
            <br />
            <button
              className="add-note-button loose-action"
              onClick={addNoteClicked}
            >
              New note
            </button>
          </div>
        </div>
      ) : (
        <div className="board-view">No board selected</div>
      )}
    </>
  );
}
