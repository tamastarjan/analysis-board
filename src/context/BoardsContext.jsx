import { createContext, useEffect, useState } from "react";

const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export class State {
  constructor() {
    this.boards = [];
    this.selectedBoard = null;
    this.type = "State";
  }
}

export class Board {
  constructor(name) {
    this.id = uid();
    this.name = name;
    this.categories = [];
    this.type = "Board";
  }
}

export class CategoryNode {
  constructor(name) {
    this.id = uid();
    this.name = name;
    this.children = [];
    this.type = "CategoryNode";
  }
}

export class ItemNode {
  constructor(name) {
    this.id = uid();
    this.name = name;
    this.children = [];
    this.type = "ItemNode";
  }
}

export const BoardContext = createContext([]);

export const BoardContextProvider = ({ children }) => {
  const initialState = new State();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const jsonState = localStorage.getItem("state");
    if (!!jsonState) {
      const parsedState = JSON.parse(jsonState);
      if (parsedState.selectedBoard) {
        const selectedBoard = findNode(
          parsedState,
          parsedState.selectedBoard.id
        );
        parsedState.selectedBoard = selectedBoard;
      }
      setState(parsedState);
    }
  }, []);

  useEffect(() => {
    if (initialState === state) {
      return;
    }

    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

  return (
    <BoardContext.Provider value={[state, setState]}>
      {children}
    </BoardContext.Provider>
  );
};

export const findNode = (node, id) => {
  if (node.id === id) {
    return node;
  }
  const children = node.children || node.boards || node.categories || [];
  for (let child of children) {
    const found = findNode(child, id);
    if (found) {
      return found;
    }
  }
  return null;
};
