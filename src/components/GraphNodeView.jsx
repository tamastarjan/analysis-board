import { useContext } from "react";
import {
  BoardContext,
  CategoryNode,
  ItemNode,
  findNode,
} from "../context/BoardsContext";

export function GraphNodeView({ node }) {
  const [context, setContext] = useContext(BoardContext);

  const addNode = (child) => {
    const name = prompt("Enter a name for the new node");
    child.name = name;
    const contextClone = JSON.parse(JSON.stringify(context));
    const clonedNode = findNode(contextClone, node.id);
    const children =
      clonedNode.children || clonedNode.boards || clonedNode.categories || [];
    children.push(child);

    context.selectedBoard = findNode(contextClone, context.selectedBoard.id);

    setContext(contextClone);
  };

  return (
    <div>
      {node.type === "Board" && (
        <div className="graph-container">
          <div className="node" onClick={() => addNode(new CategoryNode(""))}>
            {node.name}
          </div>
          <div className="graph-children">
            {node.categories.map((child) => (
              <GraphNodeView key={child.id} node={child} />
            ))}
          </div>
        </div>
      )}
      {node.type === "CategoryNode" && (
        <div className="graph-container">
          <div className="node" onClick={() => addNode(new ItemNode(""))}>
            {node.name}
          </div>
          <div className="graph-children">
            {node.children.map((child) => (
              <GraphNodeView key={child.id} node={child} />
            ))}
          </div>
        </div>
      )}
      {node.type === "ItemNode" && (
        <div className="graph-container">
          <div className="node" onClick={() => addNode(new ItemNode(""))}>
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
  );
}
