const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-soft hover:shadow-medium transform hover:scale-[1.02] active:scale-[0.98] focus:ring-teal-500',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-teal-300 shadow-soft hover:shadow-medium transform hover:scale-[1.02] active:scale-[0.98] focus:ring-teal-500',
    navy: 'bg-gradient-to-r from-navy-800 to-navy-700 hover:from-navy-900 hover:to-navy-800 text-white shadow-soft hover:shadow-medium transform hover:scale-[1.02] active:scale-[0.98] focus:ring-navy-500',
    ghost: 'text-slate-600 hover:text-teal-600 hover:bg-teal-50 focus:ring-teal-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-soft hover:shadow-medium transform hover:scale-[1.02] active:scale-[0.98] focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 mr-2" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 ml-2" />}
        </>
      )}
    </button>
  );
};

export default Button;