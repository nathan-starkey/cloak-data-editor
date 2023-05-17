///<reference path="form.js"/>
///<reference path="api.ts"/>

class CloakProvider implements IProvider {
  private content: any = null;
  private form: HTMLFormElement | null = null;
  private data: any = null;

  setContent(content: any) {
    this.content = content;
  }

  getTypes(): string[] {
    return this.content ? ["creatures", "tiles", "worlds", "images"/*, "sprites"*/]: [];
  }

  getItemsOfType(type: string): string[] {
    return this.content[type].map(o => o.id).sort((a, b) => a < b ? -1 : a == b ? 0 : 1);
  }

  createItem(type: string): string {
    let item = {
      id: "item" + Math.random().toString().slice(1)
    };

    switch (type) {
    case "creatures":
      Object.assign(item, {
        name: "",
        description: "",
        sprites: [],
        width: 1,
        height: 1,
        canFly: false,
        healthMin: 0,
        healthMax: 100,
        damageMin: 0,
        damageMax: 10
      });
      break;
    case "tiles":
      Object.assign(item, {
        name: "",
        description: "",
        sprites: [],
        isOpaque: false,
        isSolid: false
      });
      break;
    case "worlds":
      Object.assign(item, {
        name: "",
        chunks: [],
        spawns: [],
        tilePalette: ["pit"]
      });
      break;
    case "images":
      Object.assign(item, {
        path: ""
      });
      break;
    case "sprites":
      Object.assign(item, {
        image: "",
        x: 0,
        y: 0,
        width: 0,
        height: 0
      });
      break;
    default:
      throw new Error("uncaught switch statement");
    }
    
    this.content[type].push(item);
    
    return item.id;
  }

  editItem(type: string, item: string): void {
    this.assignChanges();
    if (this.form) this.form.hidden = true;
    
    if (type) {
      const form = document.forms.namedItem(type)!;
      const data = this.content[type].find(o => o.id == item);

      setFormValues(form, data);
      form.hidden = false;
      this.form = form;
      this.data = data;
    } else {
      this.form = null;
      this.data = null;
    }
  }

  deleteItem(type: string, item: string): void {
    let index = this.content[type].findIndex(o => o.id == item);

    if (index != -1) {
      this.content[type].splice(index, 1);
    }
  }

  notifyChanges() {
    this.assignChanges();
  }
  
  async openFile(handle: FileSystemFileHandle): Promise<void> {
    const text = await (await handle.getFile()).text();
    const content = JSON.parse(text);

    if (!content.images) {
      throw new Error("invalid or outdated content format");
    }

    ["creatures", "tiles"].forEach(type => content[type].forEach(o => o.sprites = o.sprites.join("\n")));
    ["worlds"].forEach(type => content[type].forEach(o => o.tilePalette = o.tilePalette.join("\n")));

    this.setContent(content);
  }

  async saveFile(handle: FileSystemFileHandle): Promise<void> {
    this.assignChanges();

    const writable = await handle.createWritable();
    const content = structuredClone(this.content);

    ["creatures", "tiles"].forEach(type => content[type].forEach(o => o.sprites = o.sprites.split("\n").filter(s => s != "")));
    ["worlds"].forEach(type => content[type].forEach(o => o.tilePalette = o.tilePalette.split("\n").filter(s => s != "")));

    content.worlds.forEach(world => world.chunks.forEach(chunk => chunk.data = "{{meta.wrap}}[" + chunk.data + "]{{/meta.wrap}}"))
    
    const text = JSON.stringify(content, null, 2).split("\"{{meta.wrap}}").join("").split("{{/meta.wrap}}\"").join("");

    writable.write(text);
    writable.close();
  }

  private assignChanges() {
    if (this.form) {
      Object.assign(this.data, getFormValues(this.form));
    }
  }
}