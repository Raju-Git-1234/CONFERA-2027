
import { useState } from 'react';
import './Contact.css';

import {
  Phone,
  Mail,
  ArrowUpRight,
  Send
} from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const contacts = [
    {
      icon: <Phone />,
      label: 'Mobile No.',
      value: '9042889350',
      link: 'tel:+919042889350'
    },
    {
      icon: <Mail />,
      label: 'Email',
      value: 'suryaraju481@gmail.com',
      link: 'mailto:suryaraju481@gmail.com'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await fetch(
        'http://localhost:5000/api/messages/send',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Message submission failed.');
      }

      setSuccess('Your message has been submitted successfully!');

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (err) {
      setError(err.message || 'Unable to send your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">

      <div className="contact-container">

        {/* CONTACT HEADING */}
        <div className="contact-heading">
          <span className="contact-subtitle">
            GET IN TOUCH
          </span>

          <h2>
            Contact <span>Us</span>
          </h2>

          <div className="contact-heading-line"></div>

          <p>
            We're here to help. Feel free to reach out to us.
          </p>
        </div>

        {/* CONTACT CARD */}
        <div className="contact-card">

          <div className="contact-card-top">
            <span>CONFERA 2027</span>

            <div className="contact-gold-line"></div>

            <h3>Let's Connect</h3>

            <p>Here's where you can reach us:</p>
          </div>

          {/* CONTACT DETAILS */}
          <div className="contact-details">

            {contacts.map((item, index) => (
              <a
                href={item.link}
                key={index}
                className="contact-item"
              >
                <div className="contact-icon">
                  {item.icon}
                </div>

                <div className="contact-info">
                  <span className="contact-label">
                    {item.label}
                  </span>

                  <span className="contact-value">
                    {item.value}
                  </span>
                </div>

                <ArrowUpRight className="contact-arrow" />
              </a>
            ))}

          </div>

          {/* MESSAGE FORM */}
          <div className="contact-form-wrapper">

            <h3>Send Us a Message</h3>

            <p className="contact-form-description">
              Have a question about CONFERA 2027? Write to us.
            </p>

            <form onSubmit={handleSubmit} className="contact-form">

              <div className="contact-form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form-group">
                <label>Your Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {success && (
                <div className="contact-success">
                  {success}
                </div>
              )}

              {error && (
                <div className="contact-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send size={17} />
              </button>

            </form>
          </div>

          {/* CONTACT FOOTER */}
          <div className="contact-card-footer">
            <span>CONFERA 2027</span>

            <span>
              Connecting Ideas • Creating Futures
            </span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Contact;
