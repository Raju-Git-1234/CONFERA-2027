
import { useState } from 'react';
import { Send, User, Mail, FileText, MessageSquare } from 'lucide-react';
import './Message.css';

function Message() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send message.');
      }

      setStatus('Your message has been submitted successfully!');

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Message submission error:', error);
      setStatus(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="message-section" id="message">
      <div className="message-container">

        <div className="message-heading">
          <span>GET IN TOUCH</span>
          <h2>Send Us a <strong>Message</strong></h2>
          <p>Have a question? Send your message to our conference team.</p>
        </div>

        <form className="message-form" onSubmit={handleSubmit}>

          <div className="message-field">
            <label><User size={17} /> Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="message-field">
            <label><Mail size={17} /> Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="message-field">
            <label><FileText size={17} /> Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter message subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className="message-field">
            <label><MessageSquare size={17} /> Your Message</label>
            <textarea
              name="message"
              placeholder="Write your message here..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          {status && (
            <p className="message-status" role="status">
              {status}
            </p>
          )}

          <button
            type="submit"
            className="message-submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
            <Send size={17} />
          </button>

        </form>
      </div>
    </section>
  );
}

export default Message;
