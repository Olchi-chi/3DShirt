import './Footer.css';
import FooterButton from '../FooterButton/FooterButton.jsx';
import logo from '../../assets/Logot.svg';

const navItems = [
  { label: 'Конструктор', id: 'constructor' },
  { label: 'Размеры', id: 'sizes' },
  { label: 'Инструкция', id: 'instruction' },
];


export default function Footer() {
  return (
  <footer>
    <section className="footer__info">
        <nav>
        {navItems.map((item) => (
          <FooterButton key={item.id} targetId={item.id}>
            {item.label}
          </FooterButton>
        ))}
    </nav>
    <div className="footer__contacts">
        <span>Номер телефона: +7 777 777 77 77</span>
        <span>Почта: email@mail.ru</span>
    </div>
    </section>
    
    <img src={logo} alt="3D Shirt" className="footer__logo" />
  </footer>
);
}