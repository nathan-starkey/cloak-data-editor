///<reference path="api.ts"/>
///<reference path="cloak.ts"/>
///<reference path="page.ts"/>

const VERSION = "v1.1.0";
const provider: IProvider = new CloakProvider();

declare interface Window {
  notifyChanges(): void;

  deleteCurrentItem(): void;
}

document.addEventListener("DOMContentLoaded", () => {
  let handle: FileSystemFileHandle | null = null;
  let isBusy = false;
  let isSaved = true;
  let selType = "";
  let selItem = "";

  document.getElementById("versionLbl")!.innerText = VERSION;

  updateFileStatus();
  updateItemMenu();
  updateLists();

  // Update checker
  (async function () {
    if (JSON.parse(await (await fetch("https://api.github.com/repos/nathan-starkey/cloak-data-editor/releases/latest")).text()).tag_name != VERSION) {
      document.getElementById("infoUpdateAvail")!.hidden = false;
    }
  })();

  document.getElementById("openFileBtn")!.addEventListener("click", async () => {
    isBusy = true;
    updateFileStatus();

    document.getElementById("errorOpenFile")!.hidden = true;

    try {
      const [handle_] = await showOpenFilePicker();
  
      try {
        await provider.openFile(handle_);

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
      await provider.saveFile(handle!);

      isSaved = true;
    } catch (err) {
      document.getElementById("errorSaveFile")!.hidden = false;
      console.error(err);
    } finally {
      isBusy = false;
      updateFileStatus();
    }
  });

  window.addEventListener("beforeunload", ev => {
    if (!isSaved) {
      ev.preventDefault();
      return (ev.returnValue = "");
    }
  }, { capture: true });

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

  window.notifyChanges = () => {
    isSaved = false;
    updateFileStatus();
    provider.notifyChanges();
  };

  window.deleteCurrentItem = () => {
    if (selType && confirm("Delete '" + selItem + "', are you sure?")) {
      provider.deleteItem(selType, selItem);
      provider.editItem("", "");
      selType = "";
      selItem = "";
      window.notifyChanges();
      updateLists();
    }
  };

  function updateFileStatus() {
    renderFileStatus(handle, isBusy, isSaved);
  }

  function updateLists() {
    renderLists(Object.fromEntries(provider.getTypes().map(type => [type, provider.getItemsOfType(type)])), selType, selItem, (type: string, item: string) => {
      selType = type;
      selItem = item;

      updateLists();
      provider.editItem(type, item);
    });
  }

  function updateItemMenu() {
    renderItemMenu(provider.getTypes(), type => {
      let item = provider.createItem(type);

      selType = type;
      selItem = item;

      updateLists();
      document.getElementById("list")!.getElementsByClassName("active").item(0)!.scrollIntoView({ block: "center" });
      window.notifyChanges();
      provider.editItem(type, item);
    });
  }
});