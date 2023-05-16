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

    content.worlds.forEach(world => {
      world.chunks.forEach(chunk => {
        chunk.data = "{WRAP}[" + chunk.data + "]{/WRAP}";
      });
    });

    let text = JSON.stringify(serialize(content), null, 2);

    text = text.split("\"{WRAP}").join("");
    text = text.split("{/WRAP}\"").join("");

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
  if (item == null || item == theItem) {
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

function deleteCurrentItem() {
  if (!confirm(`Delete '${theItemId}' - are you sure?`)) return;

  let index = theContent[theFormName].indexOf(theItem);

  if (index != -1) {
    theContent[theFormName].splice(index, 1);
  }

  isSaved = false;
  updateFileStatus();
  editItem(null, "", "");
}

function createNewItem(formName) {
  if (!Array.isArray(theContent[formName])) {
    throw new Error("invalid formName");
  }

  let i = 0;
  let id;

  do {
    id = "new" + i.toString().padStart(2, "0");
    ++i;
  } while (theContent[formName].find(item => item.id == id));
  
  let item = {id};

  theContent[formName].push(item);

  isSaved = false;
  updateFileStatus();
  editItem(item, id, formName);
  revealSelectedItem();
}

function modifyForm() {
  let form = document.forms.namedItem(theFormName);

  Object.assign(theItem, getFormValues(form));

  isSaved = false;
  updateFileStatus();
}

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

const deleteCurrentBtn = document.getElementById("deleteCurrentBtn");
const createNewBtn = document.getElementById("createNewBtn");
const fileNameLbl = document.getElementById("fileNameLbl");
const openFileBtn = document.getElementById("openFileBtn");
const saveFileBtn = document.getElementById("saveFileBtn");
const searchBox = document.getElementById("searchBox");
const listItem = document.getElementById("listItem");
const listDiv = document.getElementById("listDiv");
const sidebar = document.getElementById("sidebar");

deleteCurrentBtn.addEventListener("click", deleteCurrentItem);
openFileBtn.addEventListener("click", obtainHandle);
saveFileBtn.addEventListener("click", saveChanges);
searchBox.addEventListener("input", () => setFilterString(searchBox.value));

window.addEventListener("keydown", ev => {
  if (ev.code == "KeyS" && ev.ctrlKey) {
    ev.preventDefault();
    ev.stopImmediatePropagation();

    if (theHandle) {
      saveChanges();
    }
  }
});

window.addEventListener("beforeunload", ev => {
  if (!isSaved) {
    ev.preventDefault();
    return (ev.returnValue = "");
  }
}, { capture: true });

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
  createNewBtn.disabled = false;
  deleteCurrentBtn.disabled = !theItem;
  listDiv.innerHTML = "";

  let list = [];

  for (let formName in theContent) {
    if (!Array.isArray(theContent[formName])) continue;
    if (formName == "descriptors") continue; // DEBUG
    if (formName == "worlds") continue; // DEBUG
    if (formName == "sprites") continue; // DEBUG
    if (formName == "images") continue; // DEBUG

    let sublist = [];

    for (let item of theContent[formName]) {
      if (!item || typeof item != "object" || typeof item.id != "string") continue;
      sublist.push({ item, formName });
    }

    sublist.sort((a, b) => a.item.id < b.item.id ? -1 : a.item.id == b.item.id ? 0 : 1);
    list.push(...sublist);
  }

  for (let {item, formName} of list) {
    if (!isItemShown(item.id, formName)) {
      continue;
    }

    let btn = template.cloneNode(true);
    btn.innerText = item.id;
    btn.addEventListener("click", editItem.bind(null, item, item.id, formName));
    listDiv.append(btn);

    if (item == theItem) {
      btn.classList.add("active");
    }
  }

  sidebar.scrollTop = scrollTop;
}

function revealSelectedItem() {
  let elem = listDiv.querySelector(".active");

  if (elem) {
    elem.scrollIntoView({ block: "center", behavior: "smooth" });
  }
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