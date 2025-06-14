import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import Sidebar from '@/components/organisms/Sidebar';
import FileList from '@/components/organisms/FileList';
import PreviewPanel from '@/components/organisms/PreviewPanel';

const FileManager = () => {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewPanelVisible, setPreviewPanelVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  const handleFolderSelect = (folder) => {
    setCurrentFolder(folder);
    setCurrentPath(folder.path);
    setSelectedFile(null);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (!file.isFolder) {
      setPreviewPanelVisible(true);
    }
  };

  const handleFolderNavigate = (folder) => {
    setCurrentFolder(folder);
    setCurrentPath(folder.path);
    setSelectedFile(null);
  };

  const handleBreadcrumbNavigate = (path) => {
    setCurrentPath(path);
    // Find folder by path or set to null for root
    if (path === '/') {
      setCurrentFolder(null);
    }
    setSelectedFile(null);
  };

  const togglePreviewPanel = () => {
    setPreviewPanelVisible(!previewPanelVisible);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-4 border-b-2 border-primary bg-white">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="HardDrive" size={24} className="text-primary" />
            <h1 className="font-display font-bold text-xl text-primary">FileFlow</h1>
          </div>
          
          <div className="h-6 w-px bg-primary"></div>
          
          <Breadcrumb 
            path={currentPath}
            onNavigate={handleBreadcrumbNavigate}
          />
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePreviewPanel}
            className={`p-2 border-2 border-primary transition-colors duration-150 ${
              previewPanelVisible 
                ? 'bg-primary text-white' 
                : 'bg-white text-primary hover:bg-primary hover:text-white'
            }`}
          >
            <ApperIcon name="SidebarOpen" size={16} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-150"
          >
            <ApperIcon name="Settings" size={16} />
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onFolderSelect={handleFolderSelect}
          selectedFolderId={currentFolder?.id}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* File List */}
        <FileList
          currentFolderId={currentFolder?.id}
          onFileSelect={handleFileSelect}
          onFolderNavigate={handleFolderNavigate}
        />

        {/* Preview Panel */}
        {previewPanelVisible && (
          <PreviewPanel
            selectedFile={selectedFile}
            onClose={() => setPreviewPanelVisible(false)}
            isVisible={previewPanelVisible}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t-2 border-primary bg-surface text-sm">
        <div className="flex items-center space-x-4 text-secondary">
          <span>Ready</span>
          {selectedFile && (
            <span className="font-medium text-primary">
              {selectedFile.name} selected
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-secondary">
          <span>Path: {currentPath}</span>
          <div className="h-4 w-px bg-secondary"></div>
          <span>FileFlow v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default FileManager;