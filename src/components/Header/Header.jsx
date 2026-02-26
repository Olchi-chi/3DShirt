import './Header.css';
import HeaderButton from '../HeaderButton/HeaderButton.jsx';
import logo from '../../assets/Logot.svg';

const navItems = [
  { label: 'Конструктор', id: 'constructor' },
  { label: 'Размеры', id: 'sizes' },
  { label: 'Инструкция', id: 'instruction' },
];


export default function Header() {
  return (
  <header>
    <h1>Create Your Print</h1>
    <nav>
        {navItems.map((item) => (
          <HeaderButton key={item.id} targetId={item.id}>
            {item.label}
          </HeaderButton>
        ))}
    </nav>
    <img src={logo} alt="3D Shirt" className="logo" />
  </header>
);
}