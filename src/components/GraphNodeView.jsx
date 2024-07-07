import { useContext, useState } from "react";
import {
  BoardSelectionContext,
  ItemNode,
  findNode,
  findParent,
  updateBoard,
} from "../context/BoardsContext";
import { OrphansContext, updateOrphans } from "../context/OrphansContext";
import { useDrag, useDrop } from "react-dnd";

export function GraphNodeView({ node, depth }) {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [orphans, setOrphans] = useContext(OrphansContext);
  const [collectedDragProps, drag, dragPreview] = useDrag(() => ({
    type: "ItemNode",
    item: node,
  }));

  if (!depth) {
    depth = 0;
  }

  const [collectedDropProps, drop] = useDrop(
    () => ({
      accept: ["ItemNode", "OrphanNode"],
      drop: (droppedNode, monitor) => {
        if (monitor.getItemType() === "ItemNode") {
          if (droppedNode.id === node.id) {
            return;
          }

          droppedNode = findNode(selectedBoard, droppedNode.id);

          const sourceParent = findParent(selectedBoard, droppedNode.id);
          const targetParent = findParent(selectedBoard, node.id);

          const targetIndex = targetParent.children.findIndex(
            (item) => item.id === node.id
          );
          const sourceIndex = sourceParent.children.findIndex(
            (item) => item.id === droppedNode.id
          );

          sourceParent.children.splice(sourceIndex, 1);
          targetParent.children.splice(targetIndex, 0, droppedNode);

          findNode(selectedBoard, droppedNode.id).parentId = node.id;

          const updatedBoard = updateBoard(selectedBoard);
          setSelectedBoard(updatedBoard);
        } else if (monitor.getItemType() === "OrphanNode") {
          const sourceIndex = orphans.findIndex((o) => o.id === droppedNode.id);
          orphans.splice(sourceIndex, 1);
          setOrphans(updateOrphans(orphans));

          const itemNode = new ItemNode(
            droppedNode.name,
            selectedBoard.id,
            node.id
          );
          itemNode.children = droppedNode.children || [];

          node.children.push(itemNode);

          setSelectedBoard(updateBoard(selectedBoard));
        }
      },
    }),
    [selectedBoard, node, orphans]
  );

  const addNodeClicked = () => {
    const name = prompt("Enter a name for the new node");
    if (!name) {
      return;
    }

    const child = new ItemNode(name, selectedBoard.id, node.id);
    node.children.push(child);

    const updatedBoard = updateBoard(selectedBoard);
    setSelectedBoard(updatedBoard);
  };

  const editNodeClicked = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const name = prompt("Enter a new name for the node", node.name);
    if (!name) {
      return;
    }

    const boardClone = JSON.parse(JSON.stringify(selectedBoard));
    const clonedNode = findNode(boardClone, node.id);
    clonedNode.name = name;

    updateBoard(boardClone);
    setSelectedBoard(boardClone);
  };

  const deleteNodeClicked = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this node?"
    );
    if (!confirmDelete) {
      return;
    }

    const parent = findParent(selectedBoard, node.id);
    const index = parent.children.findIndex((c) => c.id === node.id);
    parent.children.splice(index, 1);

    const updatedBoard = updateBoard(selectedBoard);
    setSelectedBoard(updatedBoard);
  };

  return (
    <>
      {node && (
        <>
          {node.type === "ItemNode" && (
            <div
              className="graph-container"
              style={{
                marginTop: depth === 0 ? "20px" : "2px",
                marginBottom: depth === 0 ? "20px" : "2px",
                marginLeft: "4px",
              }}
            >
              <div
                className={
                  "node" +
                  (node.id === selectedBoard.highlightedNode
                    ? " highlighted"
                    : "")
                }
                id={node.id}
                ref={(el) => {
                  drag(el);
                  drop(el);
                  dragPreview(el);
                }}
                {...collectedDragProps}
                {...collectedDropProps}
                onClick={addNodeClicked}
                onMouseEnter={() => setActionsVisible(true)}
                onMouseLeave={() => setActionsVisible(false)}
              >
                {actionsVisible && (
                  <div className="node-actions">
                    <button className="node-action" onClick={editNodeClicked}>
                      E
                    </button>
                    <button className="node-action" onClick={deleteNodeClicked}>
                      X
                    </button>
                  </div>
                )}
                {node.name}
              </div>
              <div className="graph-children">
                {node.children.map((child) => (
                  <GraphNodeView
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
