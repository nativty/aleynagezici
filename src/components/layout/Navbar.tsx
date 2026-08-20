import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`navbar${menuOpen ? ' menu-open' : ''}`}>
      <Link className="logo" to="/" aria-label="Home">
        ag
      </Link>

      {/* Desktop nav */}
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/portfolio">PORTFOLIO</NavLink>
        <NavLink to="/about">ABOUT</NavLink>
        <NavLink to="/cv">CV</NavLink>
        <NavLink to="/contact">CONTACT</NavLink>
      </nav>

      {/* Mobile hamburger button */}
      <button
        className={`hamburger${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <NavLink to="/portfolio">PORTFOLIO</NavLink>
          <NavLink to="/about">ABOUT</NavLink>
          <NavLink to="/cv">CV</NavLink>
          <NavLink to="/contact">CONTACT</NavLink>
        </nav>
      )}
    </header>
  );
}
