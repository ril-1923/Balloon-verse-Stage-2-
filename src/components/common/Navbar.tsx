import { NavLink, Link } from 'react-router-dom';
import { BalloonMark } from './BalloonMark';

export function Navbar() {
  return (
    <header className="site-nav">
      <nav className="navbar navbar-expand px-3 px-md-4" aria-label="Main">
        <Link to="/" className="navbar-brand site-nav__brand">
          <BalloonMark size={26} />
          <span>BalloonVerse</span>
        </Link>
        <ul className="navbar-nav ms-auto gap-1">
          <li className="nav-item">
            <NavLink to="/" end className="nav-link site-nav__link">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/worlds" className="nav-link site-nav__link">Worlds</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/simulator" className="nav-link site-nav__link site-nav__cta">Fly</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
