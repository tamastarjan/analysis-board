import { useContext, useState } from "react";
import {
  BoardSelectionContext,
  ItemNode,
  findNode,
  findParent,
  updateBoard,
} from "../context/BoardsContext";

export function GraphNodeView({ node }) {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);
  const [actionsVisible, setActionsVisible] = useState(false);

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
                onClick={() =>
                  addNodeClicked(new ItemNode("", selectedBoard.id, node.id))
                }
                onMouseEnter={() => setActionsVisible(true)}
                onMouseLeave={() => setActionsVisible(false)}
              >
                {actionsVisible && (
                  <div className="node-actions">
                    <button onClick={editNodeClicked}>E</button>
                    <button onClick={deleteNodeClicked}>X</button>
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
