
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ShieldCheck,
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  MapPin
} from 'lucide-react';

import './AdminLogin.css';

const cityImages = [
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=2000&q=90'
];

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Background image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % cityImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Admin Login API
  const handleLogin = async (event) => {
    event.preventDefault();

    setError('');

    if (!username.trim() || !password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:5000/api/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid username or password.');
        return;
      }

      // Store authentication details
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminDetails', JSON.stringify(data.admin));

      // Navigate to admin dashboard
      navigate('/admin/dashboard');

    } catch (error) {
      console.error('Admin Login Error:', error);

      setError(
        'Unable to connect to server. Please check your backend.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      {/* FULL PAGE CITY BACKGROUND */}
      <div className="login-background">

        {cityImages.map((image, index) => (
          <div
            key={image}
            className={`login-background-slide ${
              currentImage === index ? 'active' : ''
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

      </div>

      {/* DARK OVERLAY */}
      <div className="login-page-overlay"></div>

      {/* TOP BRAND */}
      <div className="login-top-brand">
        <div className="top-brand-symbol">C</div>

        <div>
          <h2>CONFERA <span>2027</span></h2>
          <p>INTERNATIONAL CONFERENCE</p>
        </div>
      </div>

      {/* LEFT LOGIN CARD */}
      <div className="admin-login-card">

        <div className="login-card-top">
          <div className="login-shield">
            <ShieldCheck size={31} />
          </div>

          <span className="login-access-label">
            ADMINISTRATOR ACCESS
          </span>
        </div>

        <div className="login-heading">
          <h1>Welcome <span>Back.</span></h1>

          <p>
            Access your administrator workspace and
            manage the CONFERA 2027 conference.
          </p>
        </div>

        <form onSubmit={handleLogin}>

          {/* USERNAME */}
          <div className="login-form-group">
            <label htmlFor="admin-username">USERNAME</label>

            <div className="login-input-wrapper">
              <User size={19} />

              <input
                id="admin-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="login-form-group">
            <label htmlFor="admin-password">PASSWORD</label>

            <div className="login-input-wrapper">
              <LockKeyhole size={19} />

              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            <span>
              {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
            </span>

            <ArrowRight size={20} />
          </button>

        </form>

        <div className="login-footer">
          <LockKeyhole size={15} />
          <span>Secure Administrator Portal</span>
        </div>

      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="login-right-content">

        <span className="right-content-label">
          THE FUTURE OF INNOVATION
        </span>

        <h2>
          Ideas That
          <br />
          <span>Shape Tomorrow.</span>
        </h2>

        <div className="right-content-line"></div>

        <p>
          Connecting researchers, innovators and global
          minds to create meaningful impact through
          knowledge and collaboration.
        </p>

        <div className="login-location">
          <MapPin size={18} />
          <span>NEW YORK CITY · GLOBAL VISION</span>
        </div>

      </div>

      {/* FOOTER */}
      <div className="login-copyright">
        <span>© 2027 CONFERA. ALL RIGHTS RESERVED.</span>
        <span>POWERED BY DEV SPECTRA</span>
      </div>

      {/* IMAGE INDICATORS */}
      <div className="login-image-indicators">
        {cityImages.map((_, index) => (
          <button
            key={index}
            type="button"
            className={currentImage === index ? 'active' : ''}
            onClick={() => setCurrentImage(index)}
            aria-label={`Show background image ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}

export default AdminLogin;