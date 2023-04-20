renderEntryList(["Option 1", "Option 2", "Option 3"]);

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

function renderEntryList(items) {
  // Clear the current list
  ctrEntryList.innerHTML = "";

  for (let item of items) {
    // Clone the template list item
    let entryListItem = tplEntryListItem.content.firstElementChild.cloneNode(true);
    entryListItem.innerText = item;

    // Add it the the list element
    ctrEntryList.append(entryListItem);
  }
}