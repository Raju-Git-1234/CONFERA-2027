
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import { useEffect } from 'react';

import Navbar from './components/Navbar';
import Announcement from './components/Announcement';

import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

// VISITOR TRACKING
function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    // Do not count admin visits as public website visitors
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    let visitorId = localStorage.getItem('conferaVisitorId');

    if (!visitorId) {
      visitorId = window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : 'visitor-' + Date.now() + '-' + Math.random();

      localStorage.setItem('conferaVisitorId', visitorId);
    }

    const trackVisitor = async () => {
      try {
        await fetch('http://localhost:5000/api/visitors/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ visitorId })
        });
      } catch (error) {
        console.error('Visitor tracking error:', error);
      }
    };

    trackVisitor();

    const interval = setInterval(trackVisitor, 30000);

    return () => clearInterval(interval);

  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>

      <VisitorTracker />

      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Announcement />
              <Home />
            </>
          }
        />

        {/* ADMIN LOGIN PAGE */}
        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={<Admin />}
        />

        {/* INVALID URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
