let handle = null;
let content = null;

window.addEventListener("DOMContentLoaded", () => {
  btnFileAction.addEventListener("click", openFile);
});

/**
 * Request a file handle from the user and render the view with it's contents.
 * @returns {Promise<void>} A promise that resolves after completion/error catching.
 */
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

  let entries = [];

  for (let list of ["creatures", "tiles", "worlds"]) {
    entries.push(...content[list].map(o => [list, o.id]));
  }

  renderEntries(entries);
}

/**
 * Write the 'content' as text to the file handle.
 * @returns {Promise<void>} A promise that resolves after completion/error catching.
 */
async function saveFile() {
  btnFileAction.disabled = true;

  try {
    let writable = await handle.createWritable();
    writable.write(JSON.stringify(content));
    writable.close();
  } catch (e) {
    alert("Problem encountered while trying to write to the file:\n\n" + e);
    btnFileAction.disabled = false;
    return;
  }
}

/**
 * Render a list of entries as-is (no sorting is applied here).
 * @param {[list: string, id: string][]} entries - The list of entries to render, each consisting of a list name and entry ID.
 */
function renderEntries(entries) {
  // Clear the current list
  ctrEntryList.innerHTML = "";

  for (let [list, name] of entries) {
    // Clone the template list item
    let item = tplEntryListItem.content.firstElementChild.cloneNode(true);
    item.innerText = name;
    item.dataset.list = list;
    item.dataset.name = name;
    item.addEventListener("click", e => selectEntry(item));

    // Add it the the list element
    ctrEntryList.append(item);
  }
}

/**
 * Selects an item from the entries list.
 * @param {HTMLElement | null} item - The item element to select, or null to deselect all items.
 */
function selectEntry(item) {
  let prev = ctrEntryList.querySelector(".active");

  // Deselect the previously selected item
  if (prev) {
    prev.classList.remove("active");
  }

  // Select this item if it was not previously selected
  if (prev != item && item) {
    item.classList.add("active");
  }
}