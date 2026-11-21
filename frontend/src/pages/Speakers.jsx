
import { useState, useEffect } from 'react';
import './Speakers.css';

import defaultSpeaker from '../assets/speakers/speaker1.jpg';

function Speakers() {

  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    const fetchSpeakers = async () => {

      try {

        const response = await fetch(
          'http://localhost:5000/api/conference/speakers'
        );

        if (!response.ok) {
          throw new Error('Unable to load speakers.');
        }

        const result = await response.json();

        setSpeakers(result.data || []);

      } catch (err) {

        console.error('Speakers loading error:', err);
        setError('Unable to load speakers. Please try again later.');

      } finally {

        setLoading(false);

      }

    };

    fetchSpeakers();

  }, []);

  return (

    <section id="speakers" className="speakers-section">

      <div className="speakers-decoration speakers-decoration-one"></div>
      <div className="speakers-decoration speakers-decoration-two"></div>

      <div className="speakers-container">

        {/* HEADER */}
        <div className="speakers-header">

          <span className="speakers-label">
            <span></span>
            CONFERA 2027
            <span></span>
          </span>

          <h2>
            Distinguished <span>Speakers</span>
          </h2>

          <div className="speakers-gold-line"></div>

          <p>
            Learn from distinguished academicians, researchers and
            industry experts sharing their knowledge and experience.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <p style={{ textAlign: 'center', padding: '30px' }}>
            Loading conference speakers...
          </p>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p style={{ textAlign: 'center', padding: '30px' }}>
            {error}
          </p>
        )}

        {/* SPEAKERS GRID */}
        {!loading && !error && speakers.length > 0 && (

          <div className="speakers-grid">

            {speakers.map((speaker, index) => (

              <article className="speaker-card" key={speaker.id}>

                <div className="speaker-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="speaker-image-box">

                  <img
                    src={speaker.photo_url || defaultSpeaker}
                    alt={speaker.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = defaultSpeaker;
                    }}
                  />

                  <div className="speaker-image-overlay"></div>

                </div>

                <div className="speaker-details">

                  <div className="speaker-gold-indicator"></div>

                  <h3 className="speaker-name-link">
                    {speaker.name}
                  </h3>

                  {speaker.designation && (
                    <p className="speaker-designation">
                      {speaker.designation}
                    </p>
                  )}

                  {speaker.institution && (
                    <p className="speaker-institution">
                      {speaker.institution}
                    </p>
                  )}

                  {speaker.bio && (
                    <p className="speaker-institution">
                      {speaker.bio}
                    </p>
                  )}

                </div>

                <div className="speaker-card-bottom"></div>

              </article>

            ))}

          </div>

        )}

        {/* EMPTY STATE */}
        {!loading && !error && speakers.length === 0 && (

          <p style={{ textAlign: 'center', padding: '30px' }}>
            Conference speakers will be announced soon.
          </p>

        )}

        {/* FOOTER */}
        <div className="speakers-footer">
          <span></span>
          <p>KNOWLEDGE · INNOVATION · COLLABORATION</p>
          <span></span>
        </div>

      </div>

    </section>

  );

}

export default Speakers;
