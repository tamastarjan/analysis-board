import { useContext } from "react";
import {
  BoardSelectionContext,
  ItemNode,
  updateBoard,
} from "../context/BoardsContext";
import { GraphNodeView } from "./GraphNodeView";
import { useDrop } from "react-dnd";
import { OrphansContext, updateOrphans } from "../context/OrphansContext";

export function BoardView() {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);
  const [orphans, setOrphans] = useContext(OrphansContext);
  const [collectedDropProps, drop] = useDrop(
    () => ({
      accept: ["OrphanNode"],
      drop: (droppedNode, monitor) => {
        if (monitor.getItemType() === "OrphanNode") {
          const sourceIndex = orphans.findIndex((o) => o.id === droppedNode.id);
          orphans.splice(sourceIndex, 1);
          setOrphans(updateOrphans(orphans));

          const itemNode = new ItemNode(
            droppedNode.name,
            selectedBoard.id,
            selectedBoard.id
          );

          itemNode.children = droppedNode.children || [];
          selectedBoard.children.push(itemNode);

          setSelectedBoard(updateBoard(selectedBoard));
        }
      },
    }),
    [selectedBoard, orphans]
  );

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
        <div
          className="board-view"
          ref={(el) => {
            drop(el);
          }}
          {...collectedDropProps}
        >
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
          </div>
        </div>
      ) : (
        <div className="board-view">No board selected</div>
      )}
    </>
  );
}
