import "./App.css";
import { LeftSideBar } from "./components/LeftSideBar";
import { BoardView } from "./components/BoardView";
import { BoardSelectionContext } from "./context/BoardsContext";
import { useEffect, useState } from "react";
import { RightSideBar } from "./components/RightSideBar";
import { migrateData } from "./migrations/migrations";

function App() {
  useEffect(() => {
    migrateData();
  }, []);

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
