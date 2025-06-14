import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <motion.div
          className={`w-5 h-5 border-2 border-primary bg-white flex items-center justify-center ${
            checked ? 'bg-primary' : ''
          }`}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
            >
              <ApperIcon name="Check" size={12} className="text-white" />
            </motion.div>
          )}
        </motion.div>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      {label && (
        <span className="ml-2 text-sm font-medium text-primary">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;