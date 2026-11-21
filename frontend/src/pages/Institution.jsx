
import './Institution.css';

function Institution() {
  return (
    <section id="institution" className="institution-page">
      <div className="institution-container">

        {/* LEFT CONTENT */}

        <div className="institution-content">
          <div className="institution-label">
            <span></span>
            ABOUT THE INSTITUTION
          </div>

          <h1 className="institution-heading">
            Excellence in
            <span>Education & Innovation</span>
          </h1>

          <div className="institution-gold-line"></div>

          <div className="institution-description">
            <p>
              <strong>Vidyaa Vikas College of Engineering and Technology</strong>,
              located in Tiruchengode, Tamil Nadu, is committed to providing
              quality technical education and developing future-ready
              professionals.
            </p>

            <p>
              The institution encourages academic excellence, research,
              innovation and practical learning. It provides an environment
              where students can develop technical knowledge, professional
              skills and creative thinking.
            </p>

            <p>
              Through academic activities, industry interaction and
              collaborative learning, the institution inspires students
              and researchers to explore new ideas and contribute to
              technological development.
            </p>
          </div>

          <a
  href="https://vvcet.ac.in/"
  target="_blank"
  rel="noopener noreferrer"
  className="institution-button"
>
  EXPLORE MORE
  <span>↗</span>
</a>
        </div>

        {/* RIGHT IMAGE */}

        <div className="institution-image-area">
          <div className="institution-image-decoration"></div>

          <div className="institution-image-frame">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85"
              alt="College campus"
            />

            <div className="institution-image-overlay"></div>

            <div className="institution-image-caption">
              <span>OUR INSTITUTION</span>
              <h2>Building Knowledge. Creating Futures.</h2>
            </div>
          </div>

          <div className="institution-floating-card">
            <span>VVCET</span>
            <small>TIRUCHENGODE</small>
          </div>
        </div>

      </div>

      {/* HIGHLIGHT CARDS */}

      <div className="institution-highlights">

        <div className="institution-card">
          <div className="institution-card-icon">✦</div>
          <h3>Academic Excellence</h3>
          <p>
            Encouraging quality education, knowledge and continuous learning.
          </p>
        </div>

        <div className="institution-card">
          <div className="institution-card-icon">◎</div>
          <h3>Research Culture</h3>
          <p>
            Inspiring research, innovation and new technological ideas.
          </p>
        </div>

        <div className="institution-card">
          <div className="institution-card-icon">◇</div>
          <h3>Expert Community</h3>
          <p>
            Connecting students, academicians and industry professionals.
          </p>
        </div>

        <div className="institution-card">
          <div className="institution-card-icon">✧</div>
          <h3>Innovation</h3>
          <p>
            Promoting creativity, practical knowledge and future technologies.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Institution;
