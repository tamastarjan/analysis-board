import { useContext } from "react";
import { BoardSelectionContext } from "../context/BoardsContext";
import { GraphNodeView } from "./GraphNodeView";

export function BoardView() {
  const [selectedBoard] = useContext(BoardSelectionContext);

  return (
    <>
      {selectedBoard ? (
        <div className="board-view">
          {selectedBoard.name}
          {selectedBoard.children.map((child) => {
            return <GraphNodeView key={child.id} node={child} />;
          })}
        </div>
      ) : (
        <div>No board selected</div>
      )}
    </>
  );
}
