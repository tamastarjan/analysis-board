import { getBoard, getBoards, updateBoard } from "../context/BoardsContext";

export function migrateData() {
  console.log("Checking schema version...");

  const version = localStorage.getItem("schema_version");
  console.log(`Current schema version is ${version}.`);
  if (!version) {
    v0ToV1();
  } else if (version === "1") {
    v1ToV2();
  } else {
    console.log("Schema is up to date.");
  }
  console.log("Data migration complete.");
}

function v0ToV1() {
  // Add schema version to localStorage
  console.log("Migrating schema from version 0 to version 1...");
  localStorage.setItem("schema_version", "1");
}

function v1ToV2() {
  // Add boardId and parentId to ItemNode
  console.log("Migrating schema from version 1 to version 2...");
  const boards = getBoards();

  for (let board of boards) {
    const boardData = getBoard(board.id);
    const stack = [boardData];

    while (stack.length > 0) {
      const node = stack.pop();
      node.boardId = board.id;
      if (node.children) {
        for (let child of node.children) {
          child.parentId = node.id;
          stack.push(child);
        }
      }
    }

    updateBoard(boardData);
  }

  localStorage.setItem("schema_version", "2");
}
