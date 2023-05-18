namespace Page {
  export function renderFileStatus(handle: FileSystemFileHandle | null, isBusy: boolean, isSaved: boolean) {
    const openFileBtn = document.getElementById("openFileBtn") as HTMLButtonElement;
    const saveFileBtn = document.getElementById("saveFileBtn") as HTMLButtonElement;
    const fileNameLbl = document.getElementById("fileNameLbl") as HTMLButtonElement;
  
    openFileBtn.hidden = handle != null;
    saveFileBtn.hidden = handle == null;
    openFileBtn.disabled = isBusy || handle != null;
    saveFileBtn.disabled = handle == null || isBusy || isSaved;
    fileNameLbl.innerText = handle == null ? "No file open." : handle.name;
  }
  
  export function renderLists(itemsOfTypes: { [type: string]: string[] }, selType: string, selItem: string, cb: (type: string, item: string) => void) {
    const sidebar = document.getElementById("sidebar") as HTMLDivElement;
    const searchBox = document.getElementById("searchBox") as HTMLInputElement;
    const list = document.getElementById("list") as HTMLDivElement;
    const scrollTop = sidebar.scrollTop;
    const lists = createLists(itemsOfTypes, searchBox.value, selType, selItem, cb);

    searchBox.hidden = lists.length == 0;
  
    list.innerHTML = "";
    list.append(...lists);
    sidebar.scrollTop = scrollTop;
  }
  
  export function renderItemMenu(types: string[], cb: (type: string) => void) {
    const createItemBtn = document.getElementById("createItemBtn") as HTMLButtonElement;
    const createItemMenu = document.getElementById("createItemMenu") as HTMLButtonElement;
  
    createItemBtn.hidden = types.length == 0;
    createItemMenu.innerHTML = "";
  
    for (let type of types) {
      let li = document.createElement("li");
  
      let btn = document.createElement("button");
  
      btn.innerText = type;
      btn.classList.add("dropdown-item");
      btn.addEventListener("click", () => cb(type));
  
      li.append(btn);
      createItemMenu.append(li);
    }
  }
  
  function createLists(itemsOfTypes: { [type: string]: string[] }, filter: string, selType: string, selItem: string, cb: (type: string, item: string) => void): HTMLElement[] {
    let elements: HTMLElement[] = [];
    
    for (let type in itemsOfTypes) {
      elements.push(...createList(type, itemsOfTypes[type], filter, selType, selItem, cb));
    }
  
    return elements;
  }
  
  function createList(type: string, items: string[], filter: string, selType: string, selItem: string, cb: (type: string, item: string) => void): [HTMLDivElement, HTMLDivElement] {
    let header = document.createElement("div");
  
    header.innerText = type;
    header.classList.add("list-group-header");
  
    let outer = document.createElement("div");
  
    outer.classList.add("list-group");
    outer.classList.add("list-group-flush");
    outer.classList.add("mb-1");
  
    for (let item of items) {
      let isSelected = selType != "" && selType == type && selItem == item;

      if (!filter || type == filter || item.includes(filter) || isSelected) {
        outer.append(createListItem(type, item, isSelected, cb));
      }
    }
  
    return [header, outer];
  }
  
  function createListItem(type: string, item: string, active: boolean, cb: (type: string, item: string) => void) {
    let button = document.createElement("button");
  
    button.innerText = item;
    button.classList.add("list-group-item");
    button.classList.add("list-group-item-action");
  
    if (active) {
      button.classList.add("active");
    } else {
      button.addEventListener("click", () => cb(type, item));
    }
  
    return button;
  }
}