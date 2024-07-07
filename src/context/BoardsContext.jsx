import { createContext } from "react";
import { uid } from "./uid";
import { getFaqBoard } from "./faqboard";

export class ItemNode {
  constructor(name, boardId, parentId) {
    // schema version v0
    this.id = uid();

    // schema version v0
    this.name = name;

    // schema version v0
    this.children = [];

    // schema version v0
    this.type = "ItemNode";

    // schema version v1
    this.boardId = boardId;

    // schema version v1
    this.parentId = parentId;

    // schema version v1
    this.highlightedNode = null;
  }
}

export const addBoard = (name) => {
  const board = new ItemNode(name, null, null);
  const boards = getBoards();
  boards.push({ id: board.id, name: board.name });
  localStorage.setItem("boards", JSON.stringify(boards));
  localStorage.setItem(board.id, JSON.stringify(board));
};

export const importBoard = (json) => {
  try {
    const sourceBoard = JSON.parse(json);
    const newBoardJson = json.replace(sourceBoard.id, uid());
    const newBoard = JSON.parse(newBoardJson);

    const boardsJson = localStorage.getItem("boards") || "[]";
    const boards = JSON.parse(boardsJson);
    boards.push({ id: newBoard.id, name: newBoard.name });
    localStorage.setItem("boards", JSON.stringify(boards));
    localStorage.setItem(newBoard.id, JSON.stringify(newBoard));
  } catch (e) {
    console.log(e);
    alert("Did not import board.");
  }
};

export const getBoards = () => {
  let boardsJson = localStorage.getItem("boards");
  if (!boardsJson) {
    importBoard(JSON.stringify(getFaqBoard()));
    boardsJson = localStorage.getItem("boards");
  }

  return JSON.parse(boardsJson) || [];
};

export const getBoard = (id) => {
  return JSON.parse(localStorage.getItem(id));
};

export const updateBoard = (board) => {
  const boards = getBoards();
  const index = boards.findIndex((b) => b.id === board.id);
  boards[index] = { id: board.id, name: board.name };

  localStorage.setItem(board.id, JSON.stringify(board));
  localStorage.setItem("boards", JSON.stringify(boards));

  return getBoard(board.id);
};

export const deleteBoard = (id) => {
  const boards = getBoards();
  const index = boards.findIndex((b) => b.id === id);
  boards.splice(index, 1);
  localStorage.setItem("boards", JSON.stringify(boards));
  localStorage.removeItem(id);
};

export const addNode = (boardId, parentId, node) => {
  const board = getBoard(boardId);
  const parent = findNode(board, parentId);
  parent.children.push(node);
  updateBoard(board);
};

export const deleteNode = (boardId, nodeId) => {
  const board = getBoard(boardId);
  const parent = findParent(board, nodeId);
  const index = parent.children.findIndex((c) => c.id === nodeId);
  parent.children.splice(index, 1);
  updateBoard(board);
};

export const findNode = (node, id) => {
  if (node.id === id) {
    return node;
  }
  const children = node.children || [];
  for (let child of children) {
    const found = findNode(child, id);
    if (found) {
      return found;
    }
  }
  return null;
};

export const findParent = (node, id) => {
  const children = node.children || [];

  for (let child of children) {
    if (child.id === id) {
      return node;
    }
    const parent = findParent(child, id);
    if (parent) {
      return parent;
    }
  }

  return null;
};

export const BoardSelectionContext = createContext([]);
