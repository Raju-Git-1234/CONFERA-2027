
import { useState, useEffect } from 'react';
import {
  Megaphone,
  CalendarDays,
  ArrowRight
} from 'lucide-react';

import './Announcements.css';

function Announcements() {

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    const fetchAnnouncements = async () => {
      try {

        const response = await fetch(
          'http://localhost:5000/api/conference/announcements'
        );

        if (!response.ok) {
          throw new Error('Unable to load announcements');
        }

        const result = await response.json();

        setAnnouncements(result.data || []);

      } catch (err) {

        console.error(err);
        setError('Unable to load announcements.');

      } finally {

        setLoading(false);

      }
    };

    fetchAnnouncements();

  }, []);

  return (

    <section id="announcements">

      <div className="announcement-container">

        {/* HEADER */}

        <div className="announcement-header">

          <span className="announcement-label">
            CONFERA 2027
          </span>

          <h2>
            Latest <span>Announcements</span>
          </h2>

          <div className="announcement-divider"></div>

          <p>
            Stay updated with the latest conference news and notices.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <p className="announcement-message">
            Loading announcements...
          </p>
        )}

        {/* ERROR */}

        {!loading && error && (
          <p className="announcement-message">
            {error}
          </p>
        )}

        {/* ANNOUNCEMENTS */}

        {!loading && !error && announcements.length > 0 && (

          <div className="announcement-list">

            {announcements.map((item) => (

              <article
                className="announcement-card"
                key={item.id}
              >

                <div className="announcement-icon">
                  <Megaphone size={30} />
                </div>

                <div className="announcement-content">

                  <h3>{item.title}</h3>

                  <p>{item.content}</p>

                </div>

                <div className="announcement-date">

                  <CalendarDays size={23} />

                  <span>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })
                      : 'CONFERA 2027'}
                  </span>

                </div>

                <div className="announcement-arrow">
                  <ArrowRight size={22} />
                </div>

              </article>

            ))}

          </div>

        )}

        {/* EMPTY STATE */}

        {!loading && !error && announcements.length === 0 && (

          <p className="announcement-message">
            No announcements available at the moment.
          </p>

        )}

        {/* FOOTER */}

        <div className="announcement-footer">
          <span></span>
          <p>KNOWLEDGE · INNOVATION · COLLABORATION</p>
          <span></span>
        </div>

      </div>

    </section>

  );

}

export default Announcements;
