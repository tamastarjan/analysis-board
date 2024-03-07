import { useContext, useEffect, useState } from "react";
import {
  BoardSelectionContext,
  getBoard,
  getBoards,
} from "../context/BoardsContext";

export function RightSideBar() {
  const [selectedBoard] = useContext(BoardSelectionContext);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const boards = getBoards();
    const stack = [];
    for (let board of boards) {
      const boardData = getBoard(board.id);
      stack.push(boardData);
    }

    const questions = [];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node.name.includes("?")) {
        questions.push(node);
      }
      if (node.children) {
        for (let child of node.children) {
          stack.push(child);
        }
      }
    }

    setQuestions(questions);
  }, [selectedBoard]);

  return (
    <div className="right-side-bar">
      <h2>Questions</h2>
      {questions.map((question) => {
        return (
          <div className="question" key={question.id}>
            {question.name}
          </div>
        );
      })}
    </div>
  );
}
