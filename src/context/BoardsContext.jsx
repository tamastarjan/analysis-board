import { createContext } from "react";

const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export class ItemNode {
  constructor(name) {
    this.id = uid();
    this.name = name;
    this.children = [];
    this.type = "ItemNode";
  }
}

export const addBoard = (name) => {
  const board = new ItemNode(name);
  const boards = getBoards();
  boards.push({ id: board.id, name: board.name });
  localStorage.setItem("boards", JSON.stringify(boards));
  localStorage.setItem(board.id, JSON.stringify(board));
};

export const getBoards = () => {
  return JSON.parse(localStorage.getItem("boards")) || [];
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
