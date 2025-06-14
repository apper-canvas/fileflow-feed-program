import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const ContextMenu = ({ 
  isOpen, 
  position, 
  onClose, 
  items = [],
  target = null
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultItems = [
    { 
      label: 'Rename', 
      icon: 'Edit', 
      action: 'rename',
      shortcut: 'F2'
    },
    { 
      label: 'Copy', 
      icon: 'Copy', 
      action: 'copy',
      shortcut: 'Ctrl+C'
    },
    { 
      label: 'Cut', 
      icon: 'Scissors', 
      action: 'cut',
      shortcut: 'Ctrl+X'
    },
    { 
      label: 'Delete', 
      icon: 'Trash2', 
      action: 'delete',
      shortcut: 'Del',
      danger: true
    }
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-50 bg-white border-2 border-primary shadow-lg min-w-48"
        style={{
          top: position.y,
          left: position.x
        }}
      >
        {menuItems.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              item.onClick?.(target);
              onClose();
            }}
            className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors duration-150 ${
              item.danger 
                ? 'text-error hover:bg-error hover:text-white' 
                : 'text-primary hover:bg-primary hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <ApperIcon name={item.icon} size={16} className="mr-3" />
              {item.label}
            </div>
            {item.shortcut && (
              <span className="text-xs opacity-75">{item.shortcut}</span>
            )}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextMenu;