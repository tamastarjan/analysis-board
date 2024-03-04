import logo from "./logo.svg";
import "./App.css";
import { BoardContextProvider } from "./context/BoardsContext";
import { LeftSideBar } from "./components/LeftSideBar";
import { BoardView } from "./components/BoardView";

function App() {
  return (
    <BoardContextProvider>
      <div className="horizontal-container">
        <LeftSideBar />
        <BoardView />
      </div>
    </BoardContextProvider>
  );
}

export default App;
