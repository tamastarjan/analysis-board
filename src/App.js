import "./App.css";
import { LeftSideBar } from "./components/LeftSideBar";
import { BoardView } from "./components/BoardView";
import { BoardSelectionContext } from "./context/BoardsContext";
import { useState } from "react";
import { RightSideBar } from "./components/RightSideBar";

function App() {
  return (
    <BoardSelectionContext.Provider value={useState(null)}>
      <div className="horizontal-container">
        <LeftSideBar />
        <BoardView />
        <RightSideBar />
      </div>
    </BoardSelectionContext.Provider>
  );
}

export default App;
