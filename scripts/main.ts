///<reference path="data-editor.ts"/>
///<reference path="cloak.ts"/>
///<reference path="page.ts"/>

// Global constants

const VERSION = "v1.1.2";
const plugin: DataEditor.IPlugin = new Cloak.Plugin();

// Global callbacks

let notifyChanges: () => void = () => {};
let deleteCurrentItem: () => void = () => {};

// When the document is ready...

document.addEventListener("DOMContentLoaded", () => {

  // Internal state

  let handle: FileSystemFileHandle | null = null;
  let isBusy = false;
  let isSaved = true;
  let selType = "";
  let selItem = "";

  // Render the default state

  updateFileStatus();
  updateItemMenu();
  updateLists();

  // Display the version string

  document.getElementById("versionLbl")!.innerText = VERSION;

  // Query github for the latest version

  fetch("https://api.github.com/repos/nathan-starkey/cloak-data-editor/releases/latest")
    .then(res => res.text())
    .then(text => {
      let data = JSON.parse(text);

      if (data.tag_name != VERSION) {
        document.getElementById("infoUpdateAvail")!.hidden = false;
      }
    })
    .catch(err => console.error(err));

  // Define some onclick event listeners
  
  document.getElementById("openFileBtn")!.addEventListener("click", async () => {
    isBusy = true;
    updateFileStatus();

    document.getElementById("errorOpenFile")!.hidden = true;

    try {
      const [handle_] = await showOpenFilePicker();
  
      try {
        await plugin.openFile(handle_);

        handle = handle_;

        updateLists();
        updateItemMenu();
      } catch (err) {
        document.getElementById("errorOpenFile")!.hidden = false;
        console.error(err);
      }
    } finally {
      isBusy = false;
      updateFileStatus();
    }
  });

  document.getElementById("saveFileBtn")!.addEventListener("click", async () => {
    isBusy = true;
    updateFileStatus();

    document.getElementById("errorSaveFile")!.hidden = true;

    try {
      await plugin.saveFile(handle!);

      isSaved = true;
    } catch (err) {
      document.getElementById("errorSaveFile")!.hidden = false;
      console.error(err);
    } finally {
      isBusy = false;
      updateFileStatus();
    }
  });

  // Define the searchBox input event listener

  document.getElementById("searchBox")!.addEventListener("input", () => {
    updateLists();
  });

  // Prevent leaving with unsaved changes

  window.addEventListener("beforeunload", ev => {
    if (!isSaved) {
      ev.preventDefault();
      return (ev.returnValue = "");
    }
  }, { capture: true });

  // Define some handy keyboard shortcuts

  window.addEventListener("keydown", ev => {
    if (ev.code == "KeyO" && ev.ctrlKey) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      document.getElementById("openFileBtn")!.click();
    } else if (ev.code == "KeyS" && ev.ctrlKey) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      document.getElementById("saveFileBtn")!.click();
    }
  });

  // Export global callbacks

  notifyChanges = function () {
    isSaved = false;
    updateFileStatus();
    plugin.notifyChanges();
  };

  deleteCurrentItem = function () {
    if (selType && confirm("Delete '" + selItem + "', are you sure?")) {
      plugin.deleteItem(selType, selItem);
      plugin.editItem("", "");
      selType = "";
      selItem = "";
      notifyChanges();
      updateLists();
    }
  };

  // Callbacks to update the view with scope-level state

  function updateFileStatus() {
    Page.renderFileStatus(handle, isBusy, isSaved);
  }

  function updateLists() {
    Page.renderLists(Object.fromEntries(plugin.getTypes().map(type => [type, plugin.getItemsOfType(type)])), selType, selItem, (type: string, item: string) => {
      selType = type;
      selItem = item;

      updateLists();
      plugin.editItem(type, item);
    });
  }

  function updateItemMenu() {
    Page.renderItemMenu(plugin.getTypes(), type => {
      let item = plugin.createItem(type);

      selType = type;
      selItem = item;

      updateLists();
      document.getElementById("list")!.getElementsByClassName("active").item(0)!.scrollIntoView({ block: "center" });
      notifyChanges();
      plugin.editItem(type, item);
    });
  }
});