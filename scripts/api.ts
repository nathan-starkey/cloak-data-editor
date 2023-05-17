interface IProvider {
  getTypes(): string[];

  getItemsOfType(type: string): string[];

  createItem(type: string): string;
  
  editItem(type: string, item: string): void;

  deleteItem(type: string, item: string): void;

  notifyChanges(): void;

  openFile(handle: FileSystemFileHandle): Promise<void>;

  saveFile(handle: FileSystemFileHandle): Promise<void>;
}