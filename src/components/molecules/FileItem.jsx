import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';

const FileItem = ({ 
  file, 
  onSelect, 
  onDoubleClick, 
  onContextMenu,
  isSelected = false,
  viewMode = 'list' 
}) => {
  const getFileIcon = (type) => {
    const iconMap = {
      'pdf': 'FileText',
      'docx': 'FileText',
      'xlsx': 'Sheet',
      'jpg': 'Image',
      'png': 'Image',
      'gif': 'Image',
      'mp4': 'Video',
      'mp3': 'Music',
      'zip': 'Archive',
      'tar.gz': 'Archive',
      'exe': 'Download',
      'html': 'Code',
      'css': 'Code',
      'js': 'Code',
      'md': 'FileText',
      'txt': 'FileText'
    };
    return iconMap[type] || 'File';
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

  if (viewMode === 'grid') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
        className={`relative p-4 border-2 border-primary bg-white cursor-pointer group ${
          isSelected ? 'bg-accent text-white' : 'hover:bg-surface hover:text-secondary'
        }`}
        onClick={() => onSelect(file)}
        onDoubleClick={() => onDoubleClick(file)}
        onContextMenu={(e) => onContextMenu(e, file)}
      >
        <div className="absolute top-2 left-2">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(file)}
            className={isSelected ? 'text-white' : ''}
          />
        </div>
        
        <div className="flex flex-col items-center text-center pt-6">
          <ApperIcon 
name={file.isFolder ? 'Folder' : getFileIcon(file.type)} 
            size={32} 
            className={`mb-2 ${isSelected ? 'text-white' : 'text-primary group-hover:text-secondary'}`}
          />
          <p className={`font-medium text-sm break-words ${
            isSelected ? 'text-white' : 'text-primary group-hover:text-secondary'
          }`}>
            {file.name}
          </p>
          {!file.isFolder && (
<p className={`text-xs mt-1 ${
              isSelected ? 'text-white' : 'text-secondary group-hover:text-secondary'
            }`}>
              {formatFileSize(file.size)}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
whileTap={{ scale: 0.98 }}
      className={`flex items-center p-3 border-2 border-primary bg-white cursor-pointer group ${
        isSelected ? 'bg-accent text-white' : 'hover:bg-surface hover:text-secondary'
      }`}
      onClick={() => onSelect(file)}
      onDoubleClick={() => onDoubleClick(file)}
      onContextMenu={(e) => onContextMenu(e, file)}
    >
      <Checkbox
        checked={isSelected}
        onChange={() => onSelect(file)}
        className={`mr-3 ${isSelected ? 'text-white' : ''}`}
      />
      
      <ApperIcon 
name={file.isFolder ? 'Folder' : getFileIcon(file.type)} 
        size={20} 
        className={`mr-3 flex-shrink-0 ${isSelected ? 'text-white' : 'text-primary group-hover:text-secondary'}`}
      />
      
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${
          isSelected ? 'text-white' : 'text-primary group-hover:text-secondary'
        }`}>
          {file.name}
        </p>
      </div>
      
      {!file.isFolder && (
        <>
<div className={`w-20 text-right text-sm ${
            isSelected ? 'text-white' : 'text-secondary group-hover:text-secondary'
          }`}>
            {formatFileSize(file.size)}
          </div>
          
          <div className={`w-32 text-right text-sm ml-4 ${
            isSelected ? 'text-white' : 'text-secondary group-hover:text-secondary'
          }`}>
            {formatDate(file.modified)}
          </div>
        </>
      )}
      
<div className={`w-16 text-right text-sm ml-4 ${
        isSelected ? 'text-white' : 'text-secondary group-hover:text-secondary'
      }`}>
        {file.type?.toUpperCase() || 'FOLDER'}
      </div>
    </motion.div>
  );
};

export default FileItem;