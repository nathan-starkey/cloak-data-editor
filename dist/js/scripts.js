let handle = null;
let content = null;

// renderEntryList(["Option 1", "Option 2", "Option 3"]);

btnFileAction.addEventListener("click", openFile);

async function openFile() {
  btnFileAction.disabled = true;

  let handle_;
  let content_;

  let options = {
    types: [{
      description: "JSON Files",
      accept: { "application/json": [".json"] }
    }]
  };

  try {
    // Request a file handle from the user
    [handle_] = await showOpenFilePicker(options);
  } catch (e) {
    // Perhaps the user cancelled this action
    btnFileAction.disabled = false;
    return;
  }

  try {
    let blob = await handle_.getFile();
    let text = await blob.text();
    content_ = JSON.parse(text);
  } catch (e) {
    // Something went wrong loading the file
    alert("Problem encountered while trying to read the file:\n\n" + e);
    btnFileAction.disabled = false;
    return;
  }

  handle = handle_;
  content = content_;

  // Update our view with the file's data
  lblFileLabel.innerText = handle_.name;
  btnFileAction.innerText = "Save File";
  btnFileAction.removeEventListener("click", openFile);
  btnFileAction.addEventListener("click", saveFile);
  renderEntryList([
    ...content.creatures.map(o => o.id),
    ...content.tiles.map(o => o.id),
    ...content.worlds.map(o => o.id)
  ]);
}

async function saveFile() {
  btnFileAction.disabled = true;

  try {
    let writable = await handle.createWritable();
    writable.write(JSON.stringify(content));
    writable.close();
  } catch (e) {
    alert("Problem encountered while trying to write to the file:\n\n" + e);
    btnFileAction.disabled = false;
    return
  }
}

function renderEntryList(items) {
  // Clear the current list
  ctrEntryList.innerHTML = "";

  // Sort the list in alphabetic order
  items.sort((a, b) => a < b ? -1 : 1);

  for (let item of items) {
    // Clone the template list item
    let entryListItem = tplEntryListItem.content.firstElementChild.cloneNode(true);
    entryListItem.innerText = item;
    entryListItem.addEventListener("click", e => selectEntryListItem(entryListItem));

    // Add it the the list element
    ctrEntryList.append(entryListItem);
  }
}

function selectEntryListItem(entryListItem) {
  let prevSelected = ctrEntryList.querySelector(".active");

  prevSelected?.classList.remove("active");

  if (prevSelected != entryListItem && entryListItem) {
    entryListItem.classList.add("active");
  }
}