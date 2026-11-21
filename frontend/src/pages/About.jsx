import { useEffect, useState } from 'react';
import './About.css';

const conferenceImages = [
  {
    src: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    fallback: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80'
  },
  {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    fallback: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80'
  },
  {
    src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80',
    fallback: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80'
  },
  {
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    fallback: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80'
  }
];

function About() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((previousImage) =>
        (previousImage + 1) % conferenceImages.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // SCROLL TO SCHEDULE WITHOUT PAGE NAVIGATION
  const handleScheduleClick = (event) => {
    event.preventDefault();

    const scheduleSection = document.getElementById('schedule');

    if (scheduleSection) {
      scheduleSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="about" className="about-page">

      <div className="about-section">

        {/* LEFT SIDE CONTENT */}
        <div className="about-content">

          <div className="about-small-label">
            <span></span>
            ABOUT CONFERA 2027
          </div>

          <h1 className="about-heading">
            About the
            <span> Conference</span>
          </h1>

          <div className="about-gold-line"></div>

          <div className="about-text-box">

            <p>
              <strong>
                2nd International Conference on Cognitive Informatics
                Engineering and Technology (ICCET)
              </strong>{' '}
              will be held on 20th January 2027 at Vidyaa Vikas
              College of Engineering and Technology, Tiruchengode, India.
            </p>

            <p>
              ICCET will bring together innovative academics and
              industrial experts in the field of Science, Engineering,
              Technology and Management to a common forum.
            </p>

            <p>
              This International conference presents a unique opportunity
              for Research Scholars, Students, Academicians to actively
              engage with leading technology experts.
            </p>

            <p>
              Attendees can anticipate engaging discussions,
              presentations, and demonstrations of cutting-edge
              technologies, fostering collaboration and knowledge-sharing.
            </p>

            <p>
              Hosted by VVCET, a renowned Institute dedicated to
              educational research, the conference promises to be a
              valuable platform for fostering innovation and addressing
              contemporary challenges in Engineering and Technology.
            </p>

          </div>

          <div className="about-date">
            <span className="about-date-icon">✦</span>
            WEDNESDAY, 20 JANUARY 2027
          </div>

          {/* SEE SCHEDULE */}
          <a
            href="#schedule"
            className="about-schedule-btn"
            onClick={handleScheduleClick}
          >
            SEE SCHEDULE <span>↗</span>
          </a>

        </div>

        {/* RIGHT SIDE IMAGE SLIDER */}
        <div className="about-image-area">

          <div className="about-image-frame">

            {conferenceImages.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={`Conference view ${index + 1}`}
                className={`about-slide ${
                  activeImage === index ? 'active' : ''
                }`}
                onError={(event) => {
                  const img = event.currentTarget;

                  if (img.dataset.fallbackApplied !== 'true') {
                    img.dataset.fallbackApplied = 'true';
                    img.src = image.fallback;
                  }
                }}
              />
            ))}

            <div className="about-image-overlay"></div>

            <div className="about-image-caption">
              <span>INNOVATION · KNOWLEDGE · FUTURE</span>
              <h2>
                Connecting Ideas.
                <br />
                Creating Impact.
              </h2>
            </div>

            <div className="about-image-counter">
              <span>0{activeImage + 1}</span>
              <div className="about-counter-line"></div>
              <span>0{conferenceImages.length}</span>
            </div>

          </div>

          <div className="about-image-decoration"></div>

          <div className="about-floating-label">
            <span>ICCET</span>
            <small>2027</small>
          </div>

        </div>

      </div>

    </section>
  );
}

export default About;