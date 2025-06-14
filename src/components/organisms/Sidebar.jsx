import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FolderTreeItem from '@/components/molecules/FolderTreeItem';
import { folderService } from '@/services';

const Sidebar = ({ 
  onFolderSelect, 
  selectedFolderId,
  isCollapsed = false,
  onToggleCollapse 
}) => {
const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await folderService.getAll();
      setFolders(result);
    } catch (err) {
      setError(err.message || 'Failed to load folders');
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

const handleToggleExpanded = async (folderId) => {
    try {
      const updatedFolder = await folderService.toggleExpanded(folderId);
      setFolders(prev => prev.map(f => 
        f.id === folderId ? updatedFolder : f
      ));
    } catch (err) {
      toast.error('Failed to toggle folder');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    setCreateLoading(true);
    try {
      const folderData = {
        name: newFolderName.trim(),
        path: `/${newFolderName.trim()}`,
        parentId: selectedFolderId || null
      };
      
      const newFolder = await folderService.create(folderData);
      setFolders(prev => [...prev, newFolder]);
      setShowCreateModal(false);
      setNewFolderName('');
      toast.success('Folder created successfully');
    } catch (err) {
      toast.error('Failed to create folder');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setNewFolderName('');
  };
  const renderFolderTree = (parentId = null, level = 0) => {
    const folderList = folders
      .filter(folder => folder.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));

    return folderList.map(folder => {
      const children = folders.filter(f => f.parentId === folder.id);
      
      return (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          onToggle={handleToggleExpanded}
          onSelect={onFolderSelect}
          isSelected={selectedFolderId === folder.id}
          level={level}
          children={folder.expanded ? renderFolderTree(folder.id, level + 1) : null}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className={`bg-surface border-r-2 border-primary h-full overflow-y-auto ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-secondary/20 border-2 border-secondary/30"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-surface border-r-2 border-primary h-full overflow-y-auto ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4">
          <div className="text-center text-error">
            <ApperIcon name="AlertCircle" size={24} className="mx-auto mb-2" />
            <p className="text-sm font-medium">Failed to load folders</p>
            <button 
              onClick={loadFolders}
              className="mt-2 text-xs text-accent hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.15 }}
      className="bg-surface border-r-2 border-primary h-full overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b-2 border-primary bg-white">
        {!isCollapsed && (
          <h2 className="font-display font-bold text-primary">Folders</h2>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleCollapse}
          className="text-primary hover:bg-primary hover:text-white p-1 transition-colors duration-150"
        >
          <ApperIcon 
            name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
            size={16} 
          />
        </motion.button>
      </div>

      {/* Folder Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {isCollapsed ? (
          <div className="space-y-2">
            {folders.filter(f => !f.parentId).map(folder => (
              <motion.button
                key={folder.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFolderSelect(folder)}
                className={`w-full p-2 flex items-center justify-center border-2 border-transparent ${
                  selectedFolderId === folder.id 
                    ? 'bg-accent text-white border-accent' 
                    : 'text-primary hover:bg-primary hover:text-white hover:border-primary'
                }`}
              >
                <ApperIcon name="Folder" size={20} />
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {renderFolderTree()}
          </div>
        )}
      </div>

      {/* Quick Actions */}
{!isCollapsed && (
        <div className="p-3 border-t-2 border-primary bg-white">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center py-2 text-sm font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-150"
          >
            <ApperIcon name="FolderPlus" size={16} className="mr-2" />
            New Folder
          </motion.button>
        </div>
      )}
      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white border-2 border-primary p-6 w-96 max-w-sm mx-4"
          >
            <h3 className="text-lg font-display font-bold text-primary mb-4">
              Create New Folder
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                placeholder="Enter folder name"
                className="w-full px-3 py-2 border-2 border-secondary focus:border-primary focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelCreate}
                disabled={createLoading}
                className="px-4 py-2 text-sm font-medium text-primary border-2 border-secondary hover:bg-secondary hover:text-white transition-colors duration-150 disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateFolder}
                disabled={createLoading || !newFolderName.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-white border-2 border-primary hover:bg-primary-dark disabled:opacity-50 flex items-center"
              >
                {createLoading && (
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                )}
                Create
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;