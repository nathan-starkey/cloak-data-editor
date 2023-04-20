btnFileAction.addEventListener("click", openFile);

async function openFile() {
  btnFileAction.disabled = true;

  let handle;

  let options = {
    types: [{
      description: "JSON Files",
      accept: { "application/json": [".json"] }
    }]
  };

  try {
    // Request a file handle from the user
    [handle] = await showOpenFilePicker(options);
  } catch (e) {
    // Perhaps the user cancelled this action
    btnFileAction.disabled = false;
    return;
  }

  // Update our view with the file's data
  lblFileLabel.innerText = handle.name;
  btnFileAction.innerText = "Save File";
  btnFileAction.removeEventListener("click", openFile);
}