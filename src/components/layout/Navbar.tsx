import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <Link className="logo" to="/">
        ag
      </Link>

      <nav className="nav-links">
        <NavLink to="/portfolio">PORTFOLIO</NavLink>
        <NavLink to="/about">ABOUT</NavLink>
        <NavLink to="/cv">CV</NavLink>
        <NavLink to="/contact">CONTACT</NavLink>
      </nav>
    </header>
  )
}
