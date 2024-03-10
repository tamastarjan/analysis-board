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
    const questions = [];

    for (let board of boards) {
      const boardData = getBoard(board.id);
      const stack = [boardData];

      questions.push({ id: board.id, name: board.name, questions: [] });

      while (stack.length > 0) {
        const node = stack.pop();
        if (node.name.includes("?")) {
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

  return (
    <div className="right-side-bar">
      <h2>Questions</h2>
      {questions.map((b) => {
        return (
          <div className="question-category" key={b.id}>
            <div className="question-category-name">
              <h3>{b.name}</h3>
            </div>
            {b.questions.map((q) => {
              return (
                <div className="question" key={q.id}>
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
