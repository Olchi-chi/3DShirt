import './Button.css';

export default function Button({ 
  children, 
  style, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  disabled,
  ...props 
}) {
  return (
    <button 
      className={`a-button ${disabled ? 'disabled' : ''}`}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}