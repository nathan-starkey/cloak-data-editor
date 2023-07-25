import { useState } from "react";
import ProjectStatus from "./ProjectStatus";
import Sidebar from "./Sidebar";

export default function App() {
  let [name, setName] = useState("");
  let [isBusy, setIsBusy] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [isSaved, setIsSaved] = useState(false);

  function handleOpen() {
  }

  function handleSave() {
  }

  return <>
    <Sidebar header={
      <ProjectStatus
        name={name}
        isBusy={isBusy}
        isOpen={isOpen}
        isSaved={isSaved}
        handleOpen={handleOpen}
        handleSave={handleSave}
        />
    }/>
    <div className="app-content">
    </div>
  </>
}