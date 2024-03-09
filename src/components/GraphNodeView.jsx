import { useContext, useState } from "react";
import {
  BoardSelectionContext,
  ItemNode,
  findNode,
  findParent,
  updateBoard,
} from "../context/BoardsContext";
import { useDrag, useDrop } from "react-dnd";

export function GraphNodeView({ node }) {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [collectedDragProps, drag, dragPreview] = useDrag(() => ({
    type: "node",
    item: node,
  }));
  const [collectedDropProps, drop] = useDrop(() => ({
    accept: "node",
    drop: (droppedNode) => {
      if (droppedNode.id === node.id) {
        return;
      }

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
    },
  }));

  const addNodeClicked = (child) => {
    const name = prompt("Enter a name for the new node");
    if (!name) {
      return;
    }

    child.name = name;
    const boardClone = JSON.parse(JSON.stringify(selectedBoard));
    const clonedNode = findNode(boardClone, node.id);
    const children = clonedNode.children || [];
    children.push(child);

    updateBoard(boardClone);
    setSelectedBoard(boardClone);
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
        <div>
          {node.type === "ItemNode" && (
            <div className="graph-container">
              <div
                className="node"
                ref={(el) => {
                  drag(el);
                  drop(el);
                  dragPreview(el);
                }}
                {...collectedDragProps}
                {...collectedDropProps}
                onClick={() =>
                  addNodeClicked(new ItemNode("", selectedBoard.id, node.id))
                }
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
                  <GraphNodeView key={child.id} node={child} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
