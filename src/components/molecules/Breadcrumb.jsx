import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Breadcrumb = ({ path = '', onNavigate, className = '' }) => {
  const segments = path.split('/').filter(Boolean);
  
  const handleClick = (index) => {
    const newPath = '/' + segments.slice(0, index + 1).join('/');
    onNavigate(newPath);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate('/')}
        className="flex items-center px-2 py-1 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors duration-150"
      >
        <ApperIcon name="Home" size={16} className="mr-1" />
        Root
      </motion.button>
      
      {segments.map((segment, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ApperIcon name="ChevronRight" size={16} className="text-secondary" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(index)}
            className="px-2 py-1 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors duration-150"
          >
            {segment}
          </motion.button>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;