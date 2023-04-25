/**
 * Global reference to the chosen file handle.
 * @type {FileSystemFileHandle | null}
 */
let handle = null;

/**
 * Global reference to the file's JSON content.
 * @type {Object}
 */
let content = null;

/**
 * Function that transforms and returns a piece of data. Note that it may act directly on the input data.
 * @typedef {(data: Object) => Object} processor
 */

/**
 * Represents a this editor's standard definition of a form.
 * @typedef {Object} RegistryEntry
 * @property {HTMLFormElement} form - An HTMLFormElement.
 * @property {Object} processors
 * @property {processor[]} processors.get - List of processors to transform the exported data.
 * @property {processor[]} processors.set - List of processors to transform the imported data.
 */

/**
 * Global record of forms, mapped by their list's name.
 * @type {Object.<string, RegistryEntry>}
 */
const registry = {};

window.addEventListener("DOMContentLoaded", () => {
  // Document is ready for us to attach some events.
  btnFileAction.addEventListener("click", openFile);
});

window.addEventListener("keydown", ev => {
  // When CTRL+S is pressed...
  if (ev.code == "KeyS" && ev.ctrlKey) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    
    // ...and a file is currently open...
    if (handle) {
      // ...then, save the file.
      btnFileAction.click();
    }
  }
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
 * Update the view to indicate that changes are not saved.
 */
function unsave() {
  btnFileAction.disabled = false;
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

/**
 * Run a set of processing functions on a piece of data.
 * @param {processor[]} [processors=[]] - A list of functions to process the data with.
 */
function process(data, processors = []) {
  for (let processor of processors) {
    data = processor(data);
  }

  return data;
}

/**
 * Function for external scripts to attach their own forms.
 * @param {string} list - The ID associated with this form.
 * @param {RegistryEntry} entry - A {@link RegistryEntry} structure.
 */
function register(list, entry) {
  entry.form.hidden = true;

  registry[list] = entry;
}