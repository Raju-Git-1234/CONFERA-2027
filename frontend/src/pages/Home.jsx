import './Home.css';

import About from './About';
import Schedule from './Schedule';
import Institution from './Institution';
import ProgramCommittee from './ProgramCommittee';
import Speakers from './Speakers';
import Papers from './Papers';
import PaperSubmission from './PaperSubmission';
import Publication from './Publication';
import AcceptedPapers from './AcceptedPapers';
import RegistrationModal from '../components/RegistrationModal';
import FAQ from './FAQ';
import Contact from './Contact';
import Announcements from './Announcements';

function Home() {

  // OPEN REGISTRATION POPUP
  const handleRegisterClick = (event) => {
    event.preventDefault();

    window.dispatchEvent(
      new Event('open-registration')
    );
  };

  return (
    <main className="confera-home">

      {/* HERO SECTION */}
      <section id="home" className="hero-section">

        <div className="hero-background-glow"></div>

        <div className="hero-content">

          <div className="hero-label">
            <span className="hero-live-dot"></span>
            INTERNATIONAL CONFERENCE · 2027
          </div>

          <p className="hero-eyebrow">
            CONNECT <span>·</span> COLLABORATE <span>·</span> CREATE
          </p>

          <h1 className="hero-title">
            CONFERA
            <span>2027</span>
          </h1>

          <div className="hero-line"></div>

          {/* CONFERENCE DATE */}
          <div className="hero-date">
            <span className="hero-date-icon">✦</span>
            WEDNESDAY · 20 JANUARY 2027
          </div>

          <div className="hero-conference-box">
            <p className="conference-label">
              INTERNATIONAL RESEARCH EVENT
            </p>

            <h2>
              2nd International Conference on
              <span>
                Cognitive Informatics Engineering and Technology
              </span>
            </h2>

            <div className="conference-divider">
              <span></span>
            </div>

            <p className="conference-format">
              <span></span>
              HYBRID CONFERENCE
            </p>
          </div>

          <div className="hero-actions">

            <a href="#about" className="hero-primary-btn">
              Explore Conference <span>↗</span>
            </a>

            {/* REGISTER NOW - OPEN POPUP */}
            <a
              href="#registration"
              className="hero-secondary-btn"
              onClick={handleRegisterClick}
            >
              Register Now <span>↗</span>
            </a>

          </div>

          <div className="hero-bottom-info">

            <div>
              <span className="info-number">02</span>
              <span className="info-label">EDITION</span>
            </div>

            <div>
              <span className="info-number">2027</span>
              <span className="info-label">CONFERENCE YEAR</span>
            </div>

            <div>
              <span className="info-number">GLOBAL</span>
              <span className="info-label">RESEARCH COMMUNITY</span>
            </div>

          </div>

        </div>

        <div className="hero-side-text">
          KNOWLEDGE · INNOVATION · FUTURE
        </div>

        <a href="#about" className="hero-scroll">
          <span className="scroll-line"></span>
          SCROLL TO EXPLORE
        </a>

      </section>
      {/* CONFERENCE ANNOUNCEMENTS */}
<Announcements />

      {/* ABOUT CONFERENCE SECTION */}
      <About />

      {/* CONFERENCE SCHEDULE SECTION */}
      <Schedule />

      {/* ABOUT INSTITUTION SECTION */}
      <Institution />

      {/* PROGRAM COMMITTEE SECTION */}
      <ProgramCommittee />

      {/* SPEAKERS SECTION */}
      <Speakers />

      {/* PAPERS SECTION */}
      <Papers />

      {/* PAPER SUBMISSION SECTION */}
      <PaperSubmission />

      {/* PUBLICATION SECTION */}
      <Publication />

      {/* ACCEPTED PAPERS SECTION */}
      <AcceptedPapers />

      {/* FAQ SECTION */}
      <FAQ />

      {/* CONTACT SECTION */}
      <Contact />

      {/* REGISTRATION MODAL */}
      <RegistrationModal />

      {/* REGISTRATION SECTION */}
      <section
        id="registration"
        className="home-placeholder registration-placeholder"
      >
        <p>02 — JOIN THE CONFERENCE</p>

        <h2>Be Part of CONFERA 2027.</h2>

        <p>
          Connect with researchers and innovators from around the world.
        </p>
      </section>

    </main>
  );
}

export default Home;
