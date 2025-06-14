import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PreviewPanel = ({ 
  selectedFile, 
  onClose,
  isVisible = false 
}) => {
  const [previewContent, setPreviewContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFile && isVisible) {
      loadPreview();
    }
  }, [selectedFile, isVisible]);

  const loadPreview = async () => {
    if (!selectedFile || selectedFile.isFolder) return;
    
    setLoading(true);
    // Simulate loading preview content
    setTimeout(() => {
      if (selectedFile.type === 'jpg' || selectedFile.type === 'png' || selectedFile.type === 'gif') {
        setPreviewContent({
          type: 'image',
          url: `https://picsum.photos/400/300?random=${selectedFile.id}`
        });
      } else if (selectedFile.type === 'txt' || selectedFile.type === 'md') {
        setPreviewContent({
          type: 'text',
          content: `This is a preview of ${selectedFile.name}.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
        });
      } else {
        setPreviewContent({
          type: 'unsupported',
          message: 'Preview not available for this file type'
        });
      }
      setLoading(false);
    }, 500);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-surface border-l-2 border-primary h-full overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-primary bg-white">
        <h3 className="font-display font-bold text-primary">Preview</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-primary hover:bg-primary hover:text-white p-1 transition-colors duration-150"
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!selectedFile ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center text-secondary">
              <ApperIcon name="FileQuestion" size={48} className="mx-auto mb-4" />
              <p className="text-sm">Select a file to preview</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* File Info */}
            <div className="mb-6">
              <div className="flex items-start space-x-3 mb-4">
                <ApperIcon 
                  name={selectedFile.isFolder ? 'Folder' : 'File'} 
                  size={32} 
                  className="text-primary mt-1 flex-shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-primary break-words">{selectedFile.name}</h4>
                  <p className="text-sm text-secondary">{selectedFile.type?.toUpperCase() || 'FOLDER'}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-3 text-sm">
                {!selectedFile.isFolder && (
                  <div className="flex justify-between">
                    <span className="text-secondary">Size:</span>
                    <span className="font-medium text-primary">{formatFileSize(selectedFile.size)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-secondary">Modified:</span>
                  <span className="font-medium text-primary">{formatDate(selectedFile.modified)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Path:</span>
                  <span className="font-medium text-primary text-right break-all">{selectedFile.path}</span>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            {!selectedFile.isFolder && (
              <div className="border-2 border-primary bg-white">
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-pulse text-center">
                      <div className="w-16 h-16 bg-secondary/20 border-2 border-secondary/30 mx-auto mb-2"></div>
                      <p className="text-sm text-secondary">Loading preview...</p>
                    </div>
                  </div>
                ) : previewContent ? (
                  <div className="p-4">
                    {previewContent.type === 'image' && (
                      <img 
                        src={previewContent.url} 
                        alt={selectedFile.name}
                        className="w-full h-auto border-2 border-primary"
                      />
                    )}
                    {previewContent.type === 'text' && (
                      <pre className="text-sm text-primary whitespace-pre-wrap break-words font-mono">
                        {previewContent.content}
                      </pre>
                    )}
                    {previewContent.type === 'unsupported' && (
                      <div className="text-center py-8">
                        <ApperIcon name="FileX" size={32} className="mx-auto mb-2 text-secondary" />
                        <p className="text-sm text-secondary">{previewContent.message}</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <Button variant="primary" size="small" className="w-full">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="small" className="w-full">
                <ApperIcon name="Share" size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="small" className="w-full">
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Rename
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PreviewPanel;