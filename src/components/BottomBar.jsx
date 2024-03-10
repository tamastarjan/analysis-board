import { useContext, useEffect } from "react";
import {
  OrphanNode,
  OrphansContext,
  getOrphans,
  updateOrphans,
} from "../context/OrphansContext";
import { OrphanNodeView } from "./OrphanNode";

export function BottomBar() {
  const [orphans, setOrphans] = useContext(OrphansContext);

  useEffect(() => {
    const orphansJson = getOrphans();
    setOrphans(orphansJson);
  }, []);

  const noteSubmitted = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const note = e.target.value;
      if (note.trim() === "") {
        return;
      }

      orphans.splice(0, 0, new OrphanNode(note));
      setOrphans(updateOrphans(orphans));

      e.target.blur();
      e.target.value = "";
    }
  };

  return (
    <div className="bottom-bar">
      <textarea
        className="loose-note-input"
        placeholder="Add note..."
        onKeyDown={noteSubmitted}
      ></textarea>
      <div className="loose-notes">
        {orphans.map((orphan) => (
          <OrphanNodeView orphan={orphan} key={orphan.id} />
        ))}
      </div>
    </div>
  );
}
