import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white border-2 border-primary hover:bg-white hover:text-primary",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white",
    accent: "bg-accent text-white border-2 border-accent hover:bg-white hover:text-accent",
    ghost: "bg-transparent text-primary border-2 border-transparent hover:bg-primary hover:text-white"
  };

  const sizes = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;