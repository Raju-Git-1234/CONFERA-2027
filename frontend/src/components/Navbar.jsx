
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Download,
  CheckCircle2
} from 'lucide-react';

import './Navbar.css';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const standaloneQuery = window.matchMedia(
      '(display-mode: standalone)'
    );

    const checkInstalled = async () => {
      if (
        standaloneQuery.matches ||
        window.navigator.standalone === true
      ) {
        setIsInstalled(true);
        return;
      }

      // Check installed related apps when supported.
      if (
        'getInstalledRelatedApps' in navigator
      ) {
        try {
          const relatedApps =
            await navigator.getInstalledRelatedApps();

          if (relatedApps.length > 0) {
            setIsInstalled(true);
          }
        } catch (error) {
          console.log(
            'Could not check installed apps:',
            error
          );
        }
      }
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstall
    );

    window.addEventListener(
      'appinstalled',
      handleInstalled
    );

    standaloneQuery.addEventListener(
      'change',
      checkInstalled
    );

    checkInstalled();

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstall
      );

      window.removeEventListener(
        'appinstalled',
        handleInstalled
      );

      standaloneQuery.removeEventListener(
        'change',
        checkInstalled
      );
    };
  }, []);

  const handleInstallApp = async () => {
    if (isInstalled) {
      return;
    }

    if (!deferredPrompt) {
      alert(
        'To install CONFERA 2027, open your browser menu and select Install App or Add to Home Screen.'
      );
      return;
    }

    await deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

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

    if (!section) return;

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
            <div className="brand-symbol">C</div>

            <div className="brand-text">
              <h1>
                CONFERA <span>2027</span>
              </h1>
              <p>INTERNATIONAL CONFERENCE</p>
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

            <a
              href="#speakers"
              className="nav-link"
              onClick={handleLinkClick('speakers')}
            >
              Speakers
            </a>

            <a
              href="#committee"
              className="nav-link"
              onClick={handleLinkClick('committee')}
            >
              Committee
            </a>

            <a
              href="#papers"
              className="nav-link"
              onClick={handleLinkClick('papers')}
            >
              Papers
            </a>

            <a
              href="#submission"
              className="nav-link"
              onClick={handleLinkClick('submission')}
            >
              Paper Submission
            </a>

            <a
              href="#publication"
              className="nav-link"
              onClick={handleLinkClick('publication')}
            >
              Publication
            </a>

            <a
              href="#accepted-papers"
              className="nav-link"
              onClick={handleLinkClick('accepted-papers')}
            >
              Accepted Papers
            </a>

            <a
              href="#faq"
              className="nav-link"
              onClick={handleLinkClick('faq')}
            >
              FAQ
            </a>

            <a
              href="#contact"
              className="nav-link"
              onClick={handleLinkClick('contact')}
            >
              Contact
            </a>
          </div>

          {/* INSTALL APP BUTTON */}
          <button
            className={`install-button ${
              isInstalled ? 'installed' : ''
            }`}
            onClick={handleInstallApp}
            type="button"
            disabled={isInstalled}
          >
            {isInstalled ? (
              <>
                <CheckCircle2 size={17} />
                Installed
              </>
            ) : (
              <>
                <Download size={17} />
                Install App
              </>
            )}
          </button>

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
