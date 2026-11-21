
import { useState, useEffect } from 'react';
import './Schedule.css';

import {
  CalendarDays,
  Clock,
  MapPin,
  Presentation
} from 'lucide-react';

function Schedule() {

  const [schedule, setSchedule] = useState([]);
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    const fetchSchedule = async () => {

      try {

        const [scheduleResponse, detailsResponse] =
          await Promise.all([
            fetch('http://localhost:5000/api/conference/schedule'),
            fetch('http://localhost:5000/api/conference/details')
          ]);

        if (!scheduleResponse.ok || !detailsResponse.ok) {
          throw new Error('Unable to load conference information.');
        }

        const scheduleResult = await scheduleResponse.json();
        const detailsResult = await detailsResponse.json();

        setSchedule(scheduleResult.data || []);
        setConference(detailsResult.details || null);

      } catch (err) {

        console.error('Schedule loading error:', err);
        setError('Unable to load conference schedule. Please try again later.');

      } finally {

        setLoading(false);

      }

    };

    fetchSchedule();

  }, []);

  const formatDate = (date) => {

    if (!date) return 'Date to be announced';

    const dateOnly = String(date).split('T')[0];
    const [year, month, day] = dateOnly.split('-');

    if (!year || !month || !day) return date;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();

  };

  const formatTime = (time) => {

    if (!time) return 'To Be Announced';

    const [hours, minutes] = String(time).split(':');

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

  };

  const groupedSchedule = schedule.reduce((groups, item) => {

    const date = item.session_date
      ? String(item.session_date).split('T')[0]
      : 'date-to-be-announced';

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(item);

    return groups;

  }, {});

  const scheduleDays = Object.entries(groupedSchedule);

  return (

    <section id="schedule" className="schedule-section">

      <div className="schedule-container">

        {/* HEADER */}
        <div className="schedule-heading">

          <span className="schedule-label">
            <CalendarDays size={15} />
            CONFERA 2027
          </span>

          <h2>
            Conference <span>Schedule</span>
          </h2>

          <div className="schedule-gold-line"></div>

          <p>
            Explore the conference programme and planned
            activities at CONFERA 2027.
          </p>

        </div>

        {/* CONFERENCE INFORMATION */}
        <div className="schedule-info">

          <div>
            <CalendarDays size={21} />
            <span>
              {conference?.event_date
                ? formatDate(conference.event_date)
                : 'Conference date to be announced'}
            </span>
          </div>

          <div>
            <MapPin size={21} />
            <span>
              {conference?.venue || 'Venue to be announced'}
            </span>
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="schedule-note">
            <Clock size={18} />
            <p>Loading conference schedule...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="schedule-note">
            <p>{error}</p>
          </div>
        )}

        {/* SCHEDULE DAYS */}
        {!loading && !error && scheduleDays.length > 0 && (

          <div className="schedule-days">

            {scheduleDays.map(([date, events], index) => (

              <div className="schedule-day-card" key={date}>

                <div className="schedule-day-header">

                  <div>
                    <span>
                      DAY {String(index + 1).padStart(2, '0')}
                    </span>

                    <h3>
                      {formatDate(date) === 'DATE-TO-BE-ANNOUNCED'
                        ? 'Conference Sessions'
                        : 'Conference Sessions'}
                    </h3>
                  </div>

                  <div className="schedule-day-date">
                    <CalendarDays size={17} />
                    {formatDate(date)}
                  </div>

                </div>

                <div className="schedule-events">

                  {events.map((event) => (

                    <div
                      className="schedule-event"
                      key={event.id}
                    >

                      <div className="schedule-event-icon">
                        <Presentation size={21} />
                      </div>

                      <div className="schedule-event-details">

                        <h4>{event.session_title}</h4>

                        {event.speaker_name && (
                          <p>Speaker: {event.speaker_name}</p>
                        )}

                        {event.description && (
                          <p>{event.description}</p>
                        )}

                      </div>

                      <div className="schedule-event-time">
                        <Clock size={15} />
                        {formatTime(event.start_time)}
                        {event.end_time && (
                          <> – {formatTime(event.end_time)}</>
                        )}
                      </div>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

        {/* EMPTY SCHEDULE */}
        {!loading && !error && scheduleDays.length === 0 && (

          <div className="schedule-note">
            <Clock size={18} />
            <p>
              The conference schedule will be announced
              by the organizing committee.
            </p>
          </div>

        )}

      </div>

    </section>

  );

}

export default Schedule;
