import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const FolderTreeItem = ({ 
  folder, 
  onToggle, 
  onSelect, 
  isSelected = false,
  level = 0,
  children 
}) => {
  const hasChildren = children && children.length > 0;

  return (
    <div className="select-none">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center py-2 px-2 cursor-pointer border-2 border-transparent ${
          isSelected ? 'bg-accent text-white border-accent' : 'hover:bg-primary hover:text-white hover:border-primary'
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={() => onSelect(folder)}
      >
        {hasChildren ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(folder.id);
            }}
            className={`mr-1 p-1 ${isSelected ? 'text-white' : 'text-primary hover:text-white'}`}
          >
            <ApperIcon 
              name={folder.expanded ? 'ChevronDown' : 'ChevronRight'} 
              size={16} 
            />
          </motion.button>
        ) : (
          <div className="w-6 mr-1" />
        )}
        
        <ApperIcon 
          name={folder.expanded ? 'FolderOpen' : 'Folder'} 
          size={16} 
          className={`mr-2 ${isSelected ? 'text-white' : 'text-primary hover:text-white'}`}
        />
        
        <span className={`text-sm font-medium truncate ${
          isSelected ? 'text-white' : 'text-primary hover:text-white'
        }`}>
          {folder.name}
        </span>
      </motion.div>
      
      {folder.expanded && hasChildren && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default FolderTreeItem;