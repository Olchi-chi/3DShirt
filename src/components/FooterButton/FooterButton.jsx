import './FooterButton.css';

export default function FooterButton({ targetId, children }) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button onClick={handleClick} className="footer-button">
      {children}
    </button>
  );
}