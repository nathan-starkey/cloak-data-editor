///<reference path="form.js"/>
///<reference path="data-editor.ts"/>

namespace Cloak {
  export class Plugin implements DataEditor.IPlugin {
    private content: any = null;
    private form: HTMLFormElement | null = null;
    private data: any = null;

    /**
     * Set the content to be manipulated.
     * @param content Content to manipulated.
     */
    private setContent(content: any) {
      this.content = content;
    }
    
    /**
     * Copy the current form data to the object being edited.
     */
    private applyChanges() {
      if (this.form) {
        Object.assign(this.data, getFormValues(this.form));
      }
    }
    
    public notifyChanges(): void {
      this.applyChanges();
    }

    public getTypes(): string[] {
      return this.content ? [
        "creatures",
        "tiles",
        "worlds",
        "images",
        // "sprites",
      ]: [];
    }

    public getItemsOfType(type: string): string[] {
      return this.content[type].map(o => o.id).sort((a, b) => a < b ? -1 : a == b ? 0 : 1);
    }

    public createItem(type: string): string {
      let data = createItemOfType(type);

      this.content[type].push(data);

      return data.id;
    }

    public editItem(type: string, item: string): void {
      this.applyChanges();

      if (this.form) {
        this.form.hidden = true;
        this.form = null;
        this.data = null;
      }
    
      if (type) {
        const form = document.forms.namedItem(type)!;
        const data = this.content[type].find(o => o.id == item);

        setFormValues(form, data);
        form.hidden = false;
        this.form = form;
        this.data = data;
      }
    }

    public deleteItem(type: string, item: string): void {
      let index = this.content[type].findIndex(o => o.id == item);

      if (index != -1) {
        this.content[type].splice(index, 1);
      }
    }
    
    public async openFile(handle: FileSystemFileHandle): Promise<void> {
      const text = await (await handle.getFile()).text();
      const content = JSON.parse(text);
  
      if (!content.images) {
        throw new Error("invalid or outdated content format");
      }

      propertyTransformer(content, { creatures: ["sprites"], tiles: ["sprites"], worlds: ["tilePalette"]}, v => v.join("\n"));
  
      this.setContent(content);
    }
  
    public async saveFile(handle: FileSystemFileHandle): Promise<void> {
      this.applyChanges();
  
      const writable = await handle.createWritable();
      const content = structuredClone(this.content);
  
      propertyTransformer(content, { creatures: ["sprites"], tiles: ["sprites"], worlds: ["tilePalette"]}, v => v.split("\n").filter(s => s != ""));
  
      content.worlds.forEach(world => world.chunks.forEach(chunk => chunk.data = "{{meta.wrap}}[" + chunk.data + "]{{/meta.wrap}}"))
      
      const text = JSON.stringify(content, null, 2).split("\"{{meta.wrap}}").join("").split("{{/meta.wrap}}\"").join("");
  
      writable.write(text);
      writable.close();
    }
  }

  function propertyTransformer(content: any, properties: { [type: string]: string[] }, transform: (v: any) => any) {
    for (let type in properties) {
      for (let property of properties[type]) {
        content[type].forEach(o => o[property] = transform(o[property]));
      }
    }
  }

  function createItemOfType(type: string): any {
    let item = {} as any;

    item.id = "item" + Math.random().toString().slice(1);

    switch (type) {
    case "creatures":
      item.name = "";
      item.description = "";
      item.sprites = [];
      item.width = 1;
      item.height = 1;
      item.canFly = false;
      item.healthMin = 0;
      item.healthMax = 100;
      item.damageMin = 0;
      item.damageMax = 10;
      return item;
    case "tiles":
      item.name = "";
      item.description = "";
      item.sprites = [];
      item.isOpaque = false;
      item.isSolid = false;
      return item;
    case "worlds":
      item.name = "";
      item.chunks = [];
      item.spawns = [];
      item.tilePalette = ["pit"];
      return item;
    case "images":
      item.path = "";
      return item;
    case "sprites":
      item.image = "";
      item.x = 0;
      item.y = 0;
      item.width = 0;
      item.height = 0;
      return item;
    default:
      throw new Error("uncaught switch statement");
    }
  }
}