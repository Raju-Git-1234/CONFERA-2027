
import './Publication.css';

import {
  BookOpen,
  GraduationCap,
  Globe2,
  Award,
  FileText,
  ArrowUpRight,
  BookMarked,
  ScrollText,
  Sparkles
} from 'lucide-react';

function Publication() {

  const publicationOptions = [
    {
      icon: BookOpen,
      title: 'Scopus Indexed Journals',
      description:
        'Publication opportunities in reputed Scopus-indexed international journals.'
    },
    {
      icon: GraduationCap,
      title: 'Scopus Book Chapters',
      description:
        'Opportunities to publish extended research work as Scopus-indexed book chapters.'
    },
    {
      icon: Globe2,
      title: 'Web of Science',
      description:
        'Selected extended papers may be considered for related Web of Science publications.'
    },
    {
      icon: Award,
      title: 'SCI & ESCI',
      description:
        'Publication opportunities in relevant SCI and ESCI-indexed journals.'
    },
    {
      icon: BookMarked,
      title: 'UGC Listed Journals',
      description:
        'Opportunities for publication in relevant UGC-listed journals.'
    },
    {
      icon: ScrollText,
      title: 'International Proceedings',
      description:
        'Registered papers will be included in international conference proceedings with an ISBN.'
    }
  ];

  return (
    <section id="publication" className="publication-section">

      <div className="publication-glow publication-glow-one"></div>
      <div className="publication-glow publication-glow-two"></div>

      <div className="publication-container">

        {/* HEADER */}
        <div className="publication-header">

          <span className="publication-label">
            <span></span>
            CONFERA 2027
            <span></span>
          </span>

          <h2>
            Journal <span>Publication</span>
          </h2>

          <div className="publication-title-line"></div>

          <p>
            Transform your research into a valuable academic contribution
            through international publication opportunities.
          </p>

        </div>

        {/* HERO PUBLICATION CARD */}
        <div className="publication-hero">

          <div className="publication-hero-content">

            <span className="publication-eyebrow">
              <Sparkles size={16} />
              RESEARCH TO RECOGNITION
            </span>

            <h3>
              Your Research Deserves
              <span> Global Recognition</span>
            </h3>

            <p>
              CONFERA 2027 provides publication opportunities for
              registered and extended research papers in related
              reputed international journals, based on journal
              requirements and author willingness.
            </p>

            <div className="publication-hero-note">
              <Award size={20} />
              <span>
                International Conference Proceedings with ISBN
              </span>
            </div>

          </div>

          <div className="publication-hero-art">
            <div className="publication-art-circle">
              <BookOpen size={75} strokeWidth={1.2} />
            </div>

            <div className="publication-art-small">
              <GraduationCap size={27} />
            </div>

            <span className="publication-art-text">
              KNOWLEDGE · INNOVATION · IMPACT
            </span>
          </div>

        </div>

        {/* PUBLICATION OPPORTUNITIES */}
        <div className="publication-content-header">

          <span>PUBLICATION CATEGORIES</span>

          <h3>
            Explore Publication <span>Opportunities</span>
          </h3>

          <p>
            Authors may choose suitable publication options
            according to their research and publication requirements.
          </p>

        </div>

        <div className="publication-grid">

          {publicationOptions.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                className="publication-card"
                key={item.title}
              >

                <div className="publication-card-top">
                  <div className="publication-card-icon">
                    <Icon size={27} />
                  </div>

                  <span className="publication-card-number">
                    0{index + 1}
                  </span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <div className="publication-card-bottom">
                  <span></span>
                  <ArrowUpRight size={19} />
                </div>

              </article>
            );
          })}

        </div>

        {/* PUBLICATION POLICY */}
        <div className="publication-policy">

          <div className="publication-policy-icon">
            <FileText size={29} />
          </div>

          <div className="publication-policy-content">

            <span>IMPORTANT INFORMATION</span>

            <h3>Publication Policy & Guidelines</h3>

            <p>
              All registered and extended versions of the papers
              will be considered for publication in related reputed
              international journals. Authors may choose a suitable
              journal based on their requirements and willingness.
            </p>

            <p>
              Additional publication charges may apply depending
              on the selected journal. Publication is subject to
              the journal's scope, review process and acceptance
              requirements.
            </p>

            <p>
              All registered papers will be included in the
              international conference proceedings having an
              ISBN number.
            </p>

          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="publication-cta">

          <div className="publication-cta-icon">
            <GraduationCap size={31} />
          </div>

          <div className="publication-cta-content">

            <span>CONFERA 2027</span>

            <h3>Ready to Share Your Research?</h3>

            <p>
              Submit your research paper and take the next step
              towards academic recognition.
            </p>

          </div>

          <a
            href="#registration"
            className="publication-register-button"
            onClick={(event) => {
              event.preventDefault();

              window.dispatchEvent(
                new Event('open-registration')
              );
            }}
          >
            Register Now
            <ArrowUpRight size={18} />
          </a>

        </div>

        {/* FOOTER */}
        <div className="publication-footer">
          <span></span>
          <p>RESEARCH · INNOVATION · KNOWLEDGE</p>
          <span></span>
        </div>

      </div>
    </section>
  );
}

export default Publication;
