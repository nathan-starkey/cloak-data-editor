//#region State

const openFilePickerOpts = {
  types: [{
    accept: { "application/json": [".json"] },
    description: "JSON files"
  }]
};

let isBusy = false;
let isSaved = true;
let theHandle = null;
let theContent = null;
let theItem = null;
let theFormName = "";
let theItemId = "";
let theFilterTerms = [];

//#endregion

//#region Public API

async function obtainHandle() {
  if (isBusy) return;

  isBusy = true;
  updateFileStatus();
  
  let handle;

  try {
    [handle] = await showOpenFilePicker(openFilePickerOpts);
    await setHandle(handle);
  } catch (err) {
    if (handle) alert(err);
  }

  isBusy = false;
  updateFileStatus();
}

async function saveChanges() {
  if (isBusy) return;

  isBusy = true;
  updateFileStatus();

  try {
    const writable = await theHandle.createWritable();
    const content = structuredClone(theContent);
    const text = JSON.stringify(serialize(content));
    await writable.write(text);
    await writable.close();

    isSaved = true;
  } catch (err) {
    alert(err);
  }

  isBusy = false;
  updateFileStatus();
  updateList();
}

function editItem(item, itemId, formName) {
  if (isItemSelected(itemId, formName)) {
    theItem = null;
    theItemId = "";
    theFormName = "";
  } else {
    theItem = item;
    theItemId = itemId;
    theFormName = formName;
  }

  updateList();
  updateForm();
}

function modifyForm() {
  let form = document.forms.namedItem(theFormName);

  Object.assign(theItem, getFormValues(form));

  isSaved = false;
  updateFileStatus();
}

let a = {
  filter: "string",
  within: "",
  invert: false
};

function setFilterString(string) {
  theFilterTerms = string.split(" ").filter(s => s).map(s => {
    let arr = s.split(":");
    let filter;
    let within;
    let invert;

    if (arr.length == 1) {
      within = "";
      filter = arr[0];
    } else {
      within = arr[0];
      filter = arr[1];
    }

    invert = filter[0] == "!";

    if (invert) {
      filter = filter.slice(1);
    }

    return {
      filter,
      within,
      invert
    };
  });

  updateList();
}

//#endregion

//#region Internal API

async function setHandle(handle) {
  const file = await handle.getFile();
  const text = await file.text();
  const content = deserialize(JSON.parse(text));

  theHandle = handle;
  theContent = content;
  updateList();
}

function modifyList() {
  updateList();
}

function isItemSelected(itemId, formName) {
  return itemId && theItemId && itemId == theItemId && formName == theFormName;
}

function isItemShown(itemId, formName) {
  for (let term of theFilterTerms) {
    if (term.within && term.invert == formName.startsWith(term.within)) continue;
    if (term.filter && term.invert == itemId.startsWith(term.filter)) continue;
    return true;
  }

  return theFilterTerms.length == 0;
}

//#endregion

//#region View

const fileNameLbl = document.getElementById("fileNameLbl");
const openFileBtn = document.getElementById("openFileBtn");
const saveFileBtn = document.getElementById("saveFileBtn");
const searchBox = document.getElementById("searchBox");
const listItem = document.getElementById("listItem");
const listDiv = document.getElementById("listDiv");
const sidebar = document.getElementById("sidebar");

openFileBtn.addEventListener("click", obtainHandle);
saveFileBtn.addEventListener("click", saveChanges);
searchBox.addEventListener("input", () => setFilterString(searchBox.value));

function updateFileStatus() {
  fileNameLbl.innerText = theHandle ? theHandle.name : "No file open.";
  openFileBtn.hidden = theHandle;
  saveFileBtn.hidden = !theHandle;
  openFileBtn.disabled = isBusy;
  saveFileBtn.disabled = isBusy || isSaved;
}

function updateList() {
  let scrollTop = sidebar.scrollTop;
  let template = listItem.content.firstElementChild;

  searchBox.disabled = false;
  listDiv.innerHTML = "";

  let list = [];

  for (let formName in theContent) {
    if (!Array.isArray(theContent[formName])) continue;

    for (let item of theContent[formName]) {
      list.push([item, formName]);
    }
  }

  list.sort(([a], [b]) => !b.id || a.id < b.id ? -1 : a.id == b.id ? 0 : 1);

  for (let [item, formName] of list) {
    if (!isItemShown(item.id || "", formName)) {
      continue;
    }

    let btn = template.cloneNode(true);
    btn.innerText = item.id;
    btn.addEventListener("click", editItem.bind(null, item, item.id, formName));
    listDiv.append(btn);

    if (isItemSelected(item.id, formName)) {
      btn.classList.add("active");
    }
  }

  sidebar.scrollTop = scrollTop;
}

function updateForm() {
  for (let form of document.forms) {
    form.hidden = true;
  }

  if (theItem) {
    let form = document.forms.namedItem(theFormName);

    if (form) {
      form.hidden = false;
      setFormValues(form, theItem);
    }
  }
}

//#endregion