import files from '../mockData/files.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FileService {
  constructor() {
    this.files = [...files];
  }

  async getAll() {
    await delay(300);
    return [...this.files];
  }

  async getById(id) {
    await delay(200);
    const file = this.files.find(f => f.id === id);
    return file ? {...file} : null;
  }

  async getByFolderId(folderId) {
    await delay(250);
    return this.files.filter(f => f.parentId === folderId).map(f => ({...f}));
  }

async create(fileData) {
    await delay(300);
    
    // Handle file upload data
    if (fileData.file) {
      const file = fileData.file;
      const newFile = {
        id: Date.now().toString(),
        name: fileData.name || file.name,
        type: file.name.split('.').pop().toLowerCase(),
        size: file.size,
        modified: new Date().toISOString(),
        path: fileData.path || `/${file.name}`,
        parentId: fileData.parentId || null,
        isFolder: false,
        selected: false
      };
      this.files.push(newFile);
      return {...newFile};
    }
    
    // Handle new file creation (empty files)
    const newFile = {
      ...fileData,
      id: Date.now().toString(),
      size: fileData.size || 0,
      modified: new Date().toISOString(),
      selected: false,
      isFolder: false
    };
    this.files.push(newFile);
    return {...newFile};
  }

  async update(id, updates) {
    await delay(300);
    const index = this.files.findIndex(f => f.id === id);
    if (index !== -1) {
      this.files[index] = { ...this.files[index], ...updates, modified: new Date().toISOString() };
      return {...this.files[index]};
    }
    throw new Error('File not found');
  }

  async delete(id) {
    await delay(300);
    const index = this.files.findIndex(f => f.id === id);
    if (index !== -1) {
      const deletedFile = this.files.splice(index, 1)[0];
      return {...deletedFile};
    }
    throw new Error('File not found');
  }

  async move(fileId, newFolderId) {
    await delay(300);
    const file = this.files.find(f => f.id === fileId);
    if (file) {
      file.parentId = newFolderId;
      file.modified = new Date().toISOString();
      return {...file};
    }
    throw new Error('File not found');
  }

  async search(query, folderId = null) {
    await delay(200);
    let filteredFiles = [...this.files];
    
    if (folderId) {
      filteredFiles = filteredFiles.filter(f => f.parentId === folderId);
    }
    
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredFiles = filteredFiles.filter(f => 
        f.name.toLowerCase().includes(searchTerm) ||
        f.type.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredFiles.map(f => ({...f}));
  }
}

export default new FileService();