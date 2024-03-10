import { useDrag, useDrop } from "react-dnd";
import {
  OrphanNode,
  OrphansContext,
  updateOrphans,
} from "../context/OrphansContext";
import { useContext } from "react";
import {
  BoardSelectionContext,
  findNode,
  findParent,
  updateBoard,
} from "../context/BoardsContext";

export function OrphanNodeView({ orphan }) {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);
  const [orphans, setOrphans] = useContext(OrphansContext);
  const [collectedDragProps, drag, dragPreview] = useDrag(() => ({
    type: "OrphanNode",
    item: orphan,
  }));
  const [collectedDropProps, drop] = useDrop(
    () => ({
      accept: ["ItemNode", "OrphanNode"],
      drop: (droppedNode, monitor) => {
        if (monitor.getItemType() === "OrphanNode") {
          if (droppedNode.id === orphan.id) {
            return;
          }

          const sourceIndex = orphans.findIndex((o) => o.id === droppedNode.id);
          const targetIndex = orphans.findIndex((o) => o.id === orphan.id);

          orphans.splice(sourceIndex, 1);
          orphans.splice(targetIndex, 0, droppedNode);

          const updatedOrphans = updateOrphans(orphans);
          setOrphans(updatedOrphans);
        } else if (monitor.getItemType() === "ItemNode") {
          if (selectedBoard === null) {
            return;
          }

          const sourceNode = findNode(selectedBoard, droppedNode.id);
          const sourceParent = findParent(selectedBoard, droppedNode.id);
          sourceParent.children = sourceParent.children.filter(
            (c) => c.id !== droppedNode.id
          );
          setSelectedBoard(updateBoard(selectedBoard));

          const orphan = new OrphanNode(sourceNode.name);
          orphan.children = sourceNode.children;

          const targetIndex = orphans.findIndex((o) => o.id === orphan.id);

          orphans.splice(targetIndex, 0, orphan);
          setOrphans(updateOrphans(orphans));
        }
      },
    }),
    [orphans, orphan, selectedBoard]
  );

  return (
    <div
      ref={(ref) => {
        drag(ref);
        drop(ref);
        dragPreview(ref);
      }}
      key={orphan.id}
      className="loose-note"
      {...collectedDragProps}
      {...collectedDropProps}
    >
      {orphan.name}
    </div>
  );
}
