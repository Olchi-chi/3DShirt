import './ColorButton.css';
import { setColor } from '../../utils/shirtColorStore'; 

export default function ColorButton({ style }) {
  const handleClick = () => {
    const color = style?.['--base-color'] || '#FFFFFF';
    setColor(color);
  };

  return (
    <button 
      className="color-button"
      style={style}
      onClick={handleClick} 
    >
    </button>
  );
}