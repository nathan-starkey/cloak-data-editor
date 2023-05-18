namespace DataEditor {
  export type IPlugin = IProvider & IEditor & ISerializer;

  export interface IProvider {
    /**
     * Return a list of editable types.
     * @returns A list of types.
     */
    getTypes(): string[];
  
    /**
     * Return a list of items belonging to a specific type.
     * @param type The type of items to return.
     * @returns A list of item ids.
     */
    getItemsOfType(type: string): string[];
  }

  export interface IEditor {
    /**
     * Create an item of a specific type.
     * @param type The type of item to create.
     * @returns The id of the newly created item.
     */
    createItem(type: string): string;
    
    /**
     * Display an item for editing. If `type` is an empty string, then un-display the current item for editing.
     * @param type The type of item to edit.
     * @param item The id of the item to edit.
     */
    editItem(type: string, item: string): void;
  
    /**
     * Delete an item of a specific type.
     * @param type The type of item to delete.
     * @param item The id of the item to delete.
     */
    deleteItem(type: string, item: string): void;
  
    /**
     * Notify the provider of changes to the document.
     */
    notifyChanges(): void;
  }
  
  export interface ISerializer {
    /**
     * Open a file to initialize the Provider.
     * @param handle The file to read from.
     */
    openFile(handle: FileSystemFileHandle): Promise<void>;
  
    /**
     * Save any changes to the given file.
     * @param handle The file to write to.
     */
    saveFile(handle: FileSystemFileHandle): Promise<void>;
  }
}