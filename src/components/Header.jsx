import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          CurrencySwap
        </Link>
        
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
        
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;