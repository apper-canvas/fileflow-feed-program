import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FileItem from "@/components/molecules/FileItem";
import ContextMenu from "@/components/molecules/ContextMenu";
import { fileService } from "@/services";

const FileList = ({ 
  currentFolderId,
  onFileSelect,
  onFolderNavigate 
}) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, target: null });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('txt');

  useEffect(() => {
    loadFiles();
  }, [currentFolderId]);

  useEffect(() => {
    if (searchQuery) {
      searchFiles();
    } else {
      loadFiles();
    }
  }, [searchQuery, currentFolderId]);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = currentFolderId 
        ? await fileService.getByFolderId(currentFolderId)
        : await fileService.getAll();
      setFiles(result);
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message || 'Failed to load files');
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileService.search(searchQuery, currentFolderId);
      setFiles(result);
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message || 'Failed to search files');
      toast.error('Failed to search files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (selectedFiles.includes(file.id)) {
      setSelectedFiles(prev => prev.filter(id => id !== file.id));
    } else {
      setSelectedFiles(prev => [...prev, file.id]);
    }
    onFileSelect?.(file);
  };

  const handleFileDoubleClick = (file) => {
    if (file.isFolder) {
      onFolderNavigate?.(file);
    } else {
      // Open file preview or external application
      toast.info(`Opening ${file.name}`);
    }
  };

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      target: file
    });
  };

  const handleContextMenuAction = (action, file) => {
    switch (action) {
      case 'rename':
        toast.info(`Renaming ${file.name}`);
        break;
      case 'copy':
        toast.success(`Copied ${file.name}`);
        break;
      case 'cut':
        toast.success(`Cut ${file.name}`);
        break;
      case 'delete':
        handleDeleteFile(file);
        break;
      default:
        break;
    }
  };

const handleDeleteFile = async (file) => {
    // Input validation
    if (!file || !file.id) {
      toast.error('Invalid file selected for deletion');
      return;
    }

    try {
      // Set loading state if available
      const fileName = file.name || 'Unknown file';
      
      // Perform deletion
      await fileService.delete(file.id);
      
      // Update state after successful deletion
      setFiles(prev => prev.filter(f => f.id !== file.id));
      setSelectedFiles(prev => prev.filter(id => id !== file.id));
      
      // Success notification
      toast.success(`Successfully deleted ${fileName}`);
    } catch (err) {
      // Enhanced error logging
      console.error('Failed to delete file:', {
        fileId: file.id,
        fileName: file.name,
        error: err
      });
      
      // User-friendly error notification
      const errorMessage = err?.message || err?.toString() || 'Unknown error occurred';
      toast.error(`Failed to delete ${file.name || 'file'}: ${errorMessage}`);
    }
  };

const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    try {
      const fileExtension = newFileName.includes('.') ? '' : `.${newFileType}`;
      const fullFileName = newFileName + fileExtension;
      
      const newFile = {
        name: fullFileName,
        type: newFileType,
        size: 0,
        path: currentFolderId ? `/${fullFileName}` : `/${fullFileName}`,
        parentId: currentFolderId,
        isFolder: false
      };

      await fileService.create(newFile);
      setShowCreateModal(false);
      setNewFileName('');
      setNewFileType('txt');
      loadFiles();
      toast.success(`Created ${fullFileName}`);
    } catch (err) {
      console.error('Failed to create file:', err);
      toast.error(`Failed to create file: ${err.message || 'Unknown error'}`);
    }
  };

const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(f => f.id));
    }
  };

const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    const selectedCount = selectedFiles.length;
    
    try {
      await Promise.all(selectedFiles.map(id => fileService.delete(id)));
      setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
      setSelectedFiles([]);
      toast.success(`Successfully deleted ${selectedCount} items`);
    } catch (err) {
      console.error('Failed to delete selected files:', err);
      toast.error(`Failed to delete selected files: ${err.message || 'Unknown error'}`);
      // Reload files to ensure UI state is consistent
      loadFiles();
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'size') {
      aValue = a.size || 0;
      bValue = b.size || 0;
    } else if (sortBy === 'modified') {
      aValue = new Date(a.modified);
      bValue = new Date(b.modified);
    } else {
      aValue = aValue?.toString().toLowerCase() || '';
      bValue = bValue?.toString().toLowerCase() || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="animate-pulse"
            >
              <div className="h-12 bg-secondary/20 border-2 border-secondary/30"></div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-error" />
          <h3 className="text-lg font-bold text-primary mb-2">Error Loading Files</h3>
          <p className="text-secondary mb-4">{error}</p>
          <Button onClick={loadFiles} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="FolderOpen" size={64} className="mx-auto mb-4 text-secondary" />
          </motion.div>
          <h3 className="text-lg font-bold text-primary mb-2">
            {searchQuery ? 'No files match your search' : 'Empty folder'}
          </h3>
          <p className="text-secondary mb-4">
            {searchQuery ? 'Try a different search term' : 'This folder contains no files'}
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery('')} variant="primary">
              Clear Search
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b-2 border-primary bg-white">
          <div className="flex items-center space-x-4">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search files..."
              className="w-64"
            />
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="small"
                onClick={() => setViewMode('list')}
              >
                <ApperIcon name="List" size={16} />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="small"
onClick={() => setViewMode('grid')}
              >
                <ApperIcon name="Grid3X3" size={16} />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowCreateModal(true)}
            >
              <ApperIcon name="Plus" size={16} className="mr-1" />
              New File
            </Button>
            
            {selectedFiles.length > 0 && (
              <div className="flex items-center space-x-2 mr-4">
                <span className="text-sm font-medium text-primary">
                  {selectedFiles.length} selected
                </span>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleBulkDelete}
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="small"
              onClick={handleSelectAll}
            >
              <ApperIcon name="CheckSquare" size={16} />
            </Button>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-1 border-2 border-primary bg-white text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="size-asc">Size Small-Large</option>
              <option value="size-desc">Size Large-Small</option>
              <option value="modified-desc">Date Recent-Old</option>
              <option value="modified-asc">Date Old-Recent</option>
            </select>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'list' ? (
            <div className="space-y-2">
              <AnimatePresence>
                {sortedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FileItem
                      file={file}
                      onSelect={handleFileSelect}
                      onDoubleClick={handleFileDoubleClick}
                      onContextMenu={handleContextMenu}
                      isSelected={selectedFiles.includes(file.id)}
                      viewMode="list"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <AnimatePresence>
                {sortedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FileItem
                      file={file}
                      onSelect={handleFileSelect}
                      onDoubleClick={handleFileDoubleClick}
                      onContextMenu={handleContextMenu}
                      isSelected={selectedFiles.includes(file.id)}
                      viewMode="grid"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
<ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        target={contextMenu.target}
        items={[
          { 
            label: 'New File', 
            icon: 'Plus', 
            onClick: () => setShowCreateModal(true),
            shortcut: 'Ctrl+N'
          },
          { 
            label: 'Rename',
            icon: 'Edit', 
            onClick: (file) => handleContextMenuAction('rename', file),
            shortcut: 'F2'
          },
          { 
            label: 'Copy', 
            icon: 'Copy', 
            onClick: (file) => handleContextMenuAction('copy', file),
            shortcut: 'Ctrl+C'
          },
          { 
            label: 'Cut', 
            icon: 'Scissors', 
            onClick: (file) => handleContextMenuAction('cut', file),
            shortcut: 'Ctrl+X'
          },
          {
            label: 'Delete', 
            icon: 'Trash2', 
            onClick: (file) => handleContextMenuAction('delete', file),
            shortcut: 'Del',
            className: 'text-error hover:bg-error/10'
          }
        ]}
      />
      {/* Create File Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white border-2 border-primary p-6 w-96 max-w-full"
          >
            <h3 className="text-lg font-bold text-primary mb-4">Create New File</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">
                  File Name *
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="w-full px-3 py-2 border-2 border-secondary focus:border-primary focus:outline-none"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-primary mb-1">
                  File Type
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-secondary focus:border-primary focus:outline-none"
                >
                  <option value="txt">Text File (.txt)</option>
                  <option value="md">Markdown (.md)</option>
                  <option value="js">JavaScript (.js)</option>
                  <option value="html">HTML (.html)</option>
                  <option value="css">CSS (.css)</option>
                  <option value="json">JSON (.json)</option>
                  <option value="xml">XML (.xml)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewFileName('');
                  setNewFileType('txt');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateFile}
              >
                Create File
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
export default FileList;