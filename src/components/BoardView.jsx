import { useContext } from "react";
import { BoardContext } from "../context/BoardsContext";
import { GraphNodeView } from "./GraphNodeView";

export function BoardView() {
  const [context, setContext] = useContext(BoardContext);

  return (
    <>
      {context.selectedBoard ? (
        <div className="board-view">
          <GraphNodeView node={context.selectedBoard} />
        </div>
      ) : (
        <div>No board selected</div>
      )}
    </>
  );
}
