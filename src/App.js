import "./App.css";
import { LeftSideBar } from "./components/LeftSideBar";
import { BoardView } from "./components/BoardView";
import { BoardSelectionContext } from "./context/BoardsContext";
import { useEffect, useState } from "react";
import { RightSideBar } from "./components/RightSideBar";
import { migrateData } from "./migrations/migrations";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BottomBar } from "./components/BottomBar";
import { OrphansContext } from "./context/OrphansContext";

function App() {
  useEffect(() => {
    migrateData();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <OrphansContext.Provider value={useState([])}>
        <BoardSelectionContext.Provider value={useState(null)}>
          <div className="horizontal-container">
            <LeftSideBar />
            <div className="middle-container">
              <BoardView />
              <BottomBar />
            </div>
            <RightSideBar />
          </div>
        </BoardSelectionContext.Provider>
      </OrphansContext.Provider>
    </DndProvider>
  );
}

export default App;
