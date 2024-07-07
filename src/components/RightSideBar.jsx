import { useContext, useEffect, useState } from "react";
import {
  BoardSelectionContext,
  getBoard,
  getBoards,
} from "../context/BoardsContext";

export function RightSideBar() {
  const [selectedBoard, setSelectedBoard] = useContext(BoardSelectionContext);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const boards = getBoards();
    const questions = [];

    for (let board of boards) {
      const boardData = getBoard(board.id);
      const stack = [boardData];

      questions.push({ id: board.id, name: board.name, questions: [] });

      while (stack.length > 0) {
        const node = stack.pop();
        if (node.name.includes("?") && isNotAnswered(node)) {
          questions[questions.length - 1].questions.push(node);
        }
        if (node.children) {
          for (let child of node.children) {
            stack.push(child);
          }
        }
      }
    }

    const filteredQuestions = questions.filter((q) => q.questions.length > 0);

    setQuestions(filteredQuestions);
  }, [selectedBoard]);

  function isNotAnswered(node) {
    if (!node.children) {
      return true;
    }

    for (let child of node.children) {
      if (child.name.startsWith("A:")) {
        return false;
      }
    }

    return true;
  }

  function questionClicked(q) {
    const board = getBoard(q.boardId);
    board.highlightedNode = q.id;
    setSelectedBoard(board);
    window.setTimeout(() => {
      document.getElementById(q.id).scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="right-side-bar">
      <h1>Questions</h1>
      {questions.map((b) => {
        return (
          <div className="question-category" key={b.id}>
            <div className="question-category-name">
              <h3>{b.name}</h3>
            </div>
            {b.questions
              .slice()
              .reverse()
              .map((q) => {
                return (
                  <div
                    onClick={(e) => questionClicked(q)}
                    className="question"
                    key={q.id}
                  >
                    {q.name}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
