const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  className = '',
  required = false,
  ...props 
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-bold text-primary mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-0 py-2 text-primary bg-transparent border-0 border-b-2 border-secondary focus:border-primary focus:outline-none transition-colors duration-150 ${
          error ? 'border-error' : ''
        }`}
        {...props}
      />
      {error && (
        <p className="text-error text-sm mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;