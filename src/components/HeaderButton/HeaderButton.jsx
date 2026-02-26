import './HeaderButton.css';

export default function HeaderButton({ targetId, children }) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button onClick={handleClick} className="header-button">
      {children}
    </button>
  );
}