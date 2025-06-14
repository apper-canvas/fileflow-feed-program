import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ onSearch, placeholder = "Search files...", className = '' }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={16} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-secondary"
        />
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-6"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClear}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary"
          >
            <ApperIcon name="X" size={16} />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;