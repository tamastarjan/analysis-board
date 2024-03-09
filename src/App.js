import "./App.css";
import { LeftSideBar } from "./components/LeftSideBar";
import { BoardView } from "./components/BoardView";
import { BoardSelectionContext } from "./context/BoardsContext";
import { useEffect, useState } from "react";
import { RightSideBar } from "./components/RightSideBar";
import { migrateData } from "./migrations/migrations";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  useEffect(() => {
    migrateData();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardSelectionContext.Provider value={useState(null)}>
        <div className="horizontal-container">
          <LeftSideBar />
          <BoardView />
          <RightSideBar />
        </div>
      </BoardSelectionContext.Provider>
    </DndProvider>
  );
}

export default App;
