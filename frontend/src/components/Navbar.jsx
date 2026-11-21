
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight
} from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');

  const closeMenu = () => {
    setMobileOpen(false);
    setActiveDropdown('');
  };

  const toggleDropdown = (name) => {
    setActiveDropdown((current) =>
      current === name ? '' : name
    );
  };

  const scrollToSection = (id) => {
    closeMenu();

    if (id === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      window.history.replaceState(null, '', '#home');
      return;
    }

    const section = document.getElementById(id);

    if (!section) {
      return;
    }

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });

    window.history.replaceState(null, '', `#${id}`);
  };

  const handleLinkClick = (id) => (event) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <header className="site-header">

      <nav className="main-navbar">

        <div className="navbar-inner">

          {/* LOGO */}
          <a
            href="#home"
            className="brand-logo"
            onClick={handleLinkClick('home')}
          >
            <div className="brand-symbol">
              C
            </div>

            <div className="brand-text">
              <h1>
                CONFERA <span>2027</span>
              </h1>

              <p>
                INTERNATIONAL CONFERENCE
              </p>
            </div>
          </a>

          {/* MOBILE MENU BUTTON */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={27} />
            ) : (
              <Menu size={27} />
            )}
          </button>

          {/* NAVIGATION LINKS */}
          <div
            className={`nav-menu ${
              mobileOpen ? 'show-menu' : ''
            }`}
          >

            {/* HOME */}
            <a
              href="#home"
              className="nav-link"
              onClick={handleLinkClick('home')}
            >
              Home
            </a>

            {/* ABOUT DROPDOWN */}
            <div
              className="nav-dropdown"
              onMouseEnter={() => {
                if (window.innerWidth > 1100) {
                  setActiveDropdown('about');
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth > 1100) {
                  setActiveDropdown('');
                }
              }}
            >

              <button
                className={`nav-link dropdown-trigger ${
                  activeDropdown === 'about'
                    ? 'dropdown-active'
                    : ''
                }`}
                onClick={() => toggleDropdown('about')}
                aria-expanded={activeDropdown === 'about'}
              >
                About
                <ChevronDown size={15} />
              </button>

              {activeDropdown === 'about' && (
                <div className="dropdown-menu">

                  <a
                    href="#about"
                    onClick={handleLinkClick('about')}
                  >
                    About Conference
                  </a>

                  <a
                    href="#institution"
                    onClick={handleLinkClick('institution')}
                  >
                    About Institution
                  </a>

                  <a
                    href="#committee"
                    onClick={handleLinkClick('committee')}
                  >
                    Organizing Committee
                  </a>

                </div>
              )}

            </div>

            {/* SPEAKERS */}
            <a
              href="#speakers"
              className="nav-link"
              onClick={handleLinkClick('speakers')}
            >
              Speakers
            </a>

            {/* COMMITTEE */}
            <a
              href="#committee"
              className="nav-link"
              onClick={handleLinkClick('committee')}
            >
              Committee
            </a>

            {/* PAPERS */}
            <a
              href="#papers"
              className="nav-link"
              onClick={handleLinkClick('papers')}
            >
              Papers
            </a>

            {/* PAPER SUBMISSION */}
            <a
              href="#submission"
              className="nav-link"
              onClick={handleLinkClick('submission')}
            >
              Paper Submission
            </a>

            {/* PUBLICATION */}
            <a
              href="#publication"
              className="nav-link"
              onClick={handleLinkClick('publication')}
            >
              Publication
            </a>

            {/* ACCEPTED PAPERS */}
            <a
              href="#accepted-papers"
              className="nav-link"
              onClick={handleLinkClick('accepted-papers')}
            >
              Accepted Papers
            </a>

            {/* FAQ */}
            <a
              href="#faq"
              className="nav-link"
              onClick={handleLinkClick('faq')}
            >
              FAQ
            </a>

            {/* CONTACT */}
            <a
              href="#contact"
              className="nav-link"
              onClick={handleLinkClick('contact')}
            >
              Contact
            </a>

          </div>

          {/* ADMIN BUTTON */}
          <Link
            to="/admin"
            className="register-button"
            onClick={closeMenu}
          >
            Admin
            <ArrowUpRight size={17} />
          </Link>

        </div>

      </nav>

    </header>
  );
}

export default Navbar;
