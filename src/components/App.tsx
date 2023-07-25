import { useState } from "react";
import ProjectStatus from "./ProjectStatus";
import Sidebar from "./Sidebar";
import { readContentFolder } from "cloak-data-utils/ContentFolder";

export default function App() {
  let [name, setName] = useState("");
  let [isBusy, setIsBusy] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [isSaved, setIsSaved] = useState(false);
  
  function handleOpen() {
    setIsBusy(true);
    readContentFolder((folder, file, content, images) => {
      setName(folder.name);
      setIsOpen(true);
      setIsBusy(false);
      setIsSaved(true);
    }, error => {
      setIsBusy(false);
      alert(error);
    });
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