import folders from '../mockData/folders.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FolderService {
  constructor() {
    this.folders = [...folders];
  }

  async getAll() {
    await delay(300);
    return [...this.folders];
  }

  async getById(id) {
    await delay(200);
    const folder = this.folders.find(f => f.id === id);
    return folder ? {...folder} : null;
  }

  async getRootFolders() {
    await delay(250);
    return this.folders.filter(f => !f.parentId).map(f => ({...f}));
  }

  async getChildren(parentId) {
    await delay(200);
    return this.folders.filter(f => f.parentId === parentId).map(f => ({...f}));
  }

  async create(folderData) {
    await delay(300);
    const newFolder = {
      ...folderData,
      id: Date.now().toString(),
      children: [],
      expanded: false
    };
    this.folders.push(newFolder);
    return {...newFolder};
  }

  async update(id, updates) {
    await delay(300);
    const index = this.folders.findIndex(f => f.id === id);
    if (index !== -1) {
      this.folders[index] = { ...this.folders[index], ...updates };
      return {...this.folders[index]};
    }
    throw new Error('Folder not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.folders.findIndex(f => f.id === id);
    if (index !== -1) {
      const deletedFolder = this.folders.splice(index, 1)[0];
      return {...deletedFolder};
    }
    throw new Error('Folder not found');
  }

  async toggleExpanded(id) {
    await delay(150);
    const folder = this.folders.find(f => f.id === id);
    if (folder) {
      folder.expanded = !folder.expanded;
      return {...folder};
    }
    throw new Error('Folder not found');
  }
}

export default new FolderService();