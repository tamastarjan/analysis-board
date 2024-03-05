import { useContext, useState } from "react";
import {
  BoardSelectionContext,
  ItemNode,
  findNode,
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

  const editNodeClicked = () => {
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

  const deleteNodeClicked = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this node?"
    );
    if (!confirmDelete) {
      return;
    }

    const boardClone = JSON.parse(JSON.stringify(selectedBoard));
    const parent = findNode(boardClone, node.parentId);
    const index = parent.children.findIndex((c) => c.id === node.id);
    parent.children.splice(index, 1);

    updateBoard(boardClone);
    setSelectedBoard(boardClone);
  };

  return (
    <>
      {node && (
        <div>
          {node.type === "ItemNode" && (
            <div className="graph-container">
              <div
                className="node"
                onClick={() => addNodeClicked(new ItemNode(""))}
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
