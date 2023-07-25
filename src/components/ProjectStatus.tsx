export default function ProjectStatus({
  name,
  isBusy,
  isOpen,
  isSaved,
  handleOpen,
  handleSave
}: {
  isOpen: boolean;
  name: string;
  isBusy: boolean;
  isSaved: boolean;
  handleOpen: () => void;
  handleSave: () => void;
}) {
  return <div className="app-project-status">
    <button className="btn btn-primary"
      onClick={isOpen ? handleSave : handleOpen}
      disabled={isOpen ? isBusy || isSaved : isBusy}
      >{isOpen ? "Save Project" : "Open Project"}</button>
    <label>{isOpen && (isSaved ? "" : "*") + name}</label>
  </div>;
}