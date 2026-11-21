
import { useState, useEffect, useCallback } from 'react';

import {
  LayoutDashboard,
  Users,
  FileText,
  Eye,
  Activity,
  CalendarDays,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Mail,
  ShieldCheck,
  Download,
  RefreshCw,
  Trash2
} from 'lucide-react';

import ConferenceManagement from './ConferenceManagement';
import './Admin.css';

function Admin() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // REGISTRATION DATA
  const [participants, setParticipants] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // PAPER SUBMISSION DATA
  const [papers, setPapers] = useState([]);
  const [totalPapers, setTotalPapers] = useState(0);
  const [paperLoading, setPaperLoading] = useState(false);
  const [paperError, setPaperError] = useState('');

  // VISITOR ANALYTICS DATA
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    onlineVisitors: 0
  });

  const [visitorLoading, setVisitorLoading] = useState(false);
  const [visitorError, setVisitorError] = useState('');

  // CONTACT MESSAGE DATA
  const [messages, setMessages] = useState([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [deletingMessageId, setDeletingMessageId] = useState(null);

  // ADMIN TOKEN
  const getAdminToken = () => {
    return localStorage.getItem('adminToken');
  };

  // HANDLE UNAUTHORIZED ACCESS
  const handleUnauthorized = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminDetails');
    window.location.href = '/admin';
  };

  // FETCH REGISTRATIONS
  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/admin/participants',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to load registrations'
        );
      }

      setParticipants(data.participants || []);

      setTotalRegistrations(
        Number(data.total ?? data.participants?.length ?? 0)
      );

    } catch (err) {
      console.error('Registration Fetch Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // FETCH PAPER SUBMISSIONS
  const fetchPapers = useCallback(async () => {
    try {
      setPaperLoading(true);
      setPaperError('');

      const response = await fetch(
        'http://localhost:5000/api/papers'
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to load paper submissions'
        );
      }

      setPapers(data.submissions || []);
      setTotalPapers(Number(data.total || 0));

    } catch (err) {
      console.error('Paper Fetch Error:', err);
      setPaperError(err.message);
    } finally {
      setPaperLoading(false);
    }
  }, []);

  // FETCH VISITOR STATISTICS
  const fetchVisitors = useCallback(async () => {
    try {
      setVisitorLoading(true);
      setVisitorError('');

      const response = await fetch(
        'http://localhost:5000/api/visitors/stats'
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to load visitor statistics'
        );
      }

      setVisitorStats({
        totalVisitors: Number(data.totalVisitors || 0),
        todayVisitors: Number(data.todayVisitors || 0),
        onlineVisitors: Number(data.onlineVisitors || 0)
      });

    } catch (err) {
      console.error('Visitor Fetch Error:', err);
      setVisitorError(err.message);
    } finally {
      setVisitorLoading(false);
    }
  }, []);

  // FETCH CONTACT MESSAGES
  const fetchMessages = useCallback(async () => {
    try {
      setMessageLoading(true);
      setMessageError('');

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/messages',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to load contact messages'
        );
      }

      setMessages(data.messages || []);

      setTotalMessages(
        Number(data.total ?? data.messages?.length ?? 0)
      );

    } catch (err) {
      console.error('Message Fetch Error:', err);
      setMessageError(err.message);
    } finally {
      setMessageLoading(false);
    }
  }, []);

  // DELETE CONTACT MESSAGE - KEEP THIS FUNCTION
  const handleDeleteMessage = async (messageId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete this message?'
    );

    if (!confirmDelete) return;

    try {
      setDeletingMessageId(messageId);
      setMessageError('');

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to delete message.'
        );
      }

      alert('Message deleted successfully!');

      await fetchMessages();

    } catch (err) {
      console.error('Delete Message Error:', err);
      setMessageError(err.message);
    } finally {
      setDeletingMessageId(null);
    }
  };

  // LOAD DASHBOARD DATA AND AUTO REFRESH
  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    fetchParticipants();
    fetchPapers();
    fetchVisitors();
    fetchMessages();

    const interval = setInterval(() => {
      if (getAdminToken()) {
        fetchVisitors();
        fetchMessages();
      }
    }, 30000);

    return () => clearInterval(interval);

  }, [
    fetchParticipants,
    fetchPapers,
    fetchVisitors,
    fetchMessages
  ]);

  // ADMIN MENU
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard /> },
    { name: 'Visitors', icon: <Eye /> },
    { name: 'Registrations', icon: <Users /> },
    { name: 'Paper Submissions', icon: <FileText /> },
    { name: 'Conference', icon: <CalendarDays /> },
    { name: 'Messages', icon: <Mail /> }
  ];

  // DASHBOARD STATISTICS
  const statistics = [
    {
      title: 'Total Visitors',
      value: visitorLoading ? '...' : visitorStats.totalVisitors,
      description: 'Total unique website visitors',
      icon: <Eye />
    },
    {
      title: "Today's Visitors",
      value: visitorLoading ? '...' : visitorStats.todayVisitors,
      description: 'Unique visitors today',
      icon: <Users />
    },
    {
      title: 'Users Online',
      value: visitorLoading ? '...' : visitorStats.onlineVisitors,
      description: 'Active within last 2 minutes',
      icon: <Activity />
    },
    {
      title: 'Registrations',
      value: loading ? '...' : totalRegistrations,
      description: 'Total registered authors',
      icon: <TrendingUp />
    }
  ];

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminDetails');
    window.location.href = '/';
  };

  // MENU CLICK
  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    setSidebarOpen(false);

    if (menuName === 'Registrations') {
      fetchParticipants();
    }

    if (menuName === 'Paper Submissions') {
      fetchPapers();
    }

    if (menuName === 'Visitors') {
      fetchVisitors();
    }

    if (menuName === 'Messages') {
      fetchMessages();
    }
  };

  // DOWNLOAD PAPER
  const handleDownloadPaper = (filePath, fileName) => {
    if (!filePath) {
      alert('Paper file path is missing.');
      return;
    }

    const downloadUrl = `http://localhost:5000${filePath}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || 'research-paper';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="admin-layout">

      {/* MOBILE MENU BUTTON */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle admin menu"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? 'admin-sidebar-open' : ''
        }`}
      >
        <div className="admin-brand">
          <div className="admin-brand-symbol">C</div>

          <div>
            <h2>
              CONFERA <span>2027</span>
            </h2>
            <p>ADMINISTRATION</p>
          </div>
        </div>

        <div className="admin-sidebar-label">
          MAIN MENU
        </div>

        <nav className="admin-navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`admin-nav-item ${
                activeMenu === item.name ? 'active' : ''
              }`}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>

              {item.name === 'Messages' && totalMessages > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#e2c995',
                  color: '#171a1e',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: '800'
                }}>
                  {totalMessages}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-divider" />

          <button
            className="admin-nav-item admin-logout"
            onClick={handleLogout}
          >
            <LogOut />
            <span>Logout / Website</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">
          <div>
            <p className="admin-header-label">
              CONFERA 2027 / ADMINISTRATION
            </p>

            <h1>{activeMenu}</h1>
          </div>

          <div className="admin-profile">
            <div className="admin-profile-avatar">
              A
            </div>

            <div>
              <h4>Administrator</h4>
              <p>
                <ShieldCheck size={12} />
                Conference Management
              </p>
            </div>
          </div>
        </header>

        {/* DASHBOARD */}
        {activeMenu === 'Dashboard' ? (
          <>
            <section className="admin-welcome">
              <div>
                <span>WELCOME TO CONFERA 2027</span>

                <h2>Conference Admin Dashboard</h2>

                <p>
                  Manage your conference activities, monitor
                  website performance, track registrations and
                  organize submissions from one central place.
                </p>
              </div>

              <div className="admin-welcome-icon">
                <LayoutDashboard />
              </div>
            </section>

            {/* STATISTICS */}
            <section className="admin-statistics">
              {statistics.map((item) => (
                <div
                  className="admin-stat-card"
                  key={item.title}
                >
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon">
                      {item.icon}
                    </div>

                    <span>LIVE DATA</span>
                  </div>

                  <h3>{item.value}</h3>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </section>

            {/* LOWER DASHBOARD */}
            <section className="admin-bottom-grid">

              <div className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h3>Website Visitors</h3>
                    <p>Live visitor analytics overview</p>
                  </div>

                  <Eye />
                </div>

                {visitorError ? (
                  <div className="admin-empty-state">
                    <Activity />
                    <h4>Unable to load analytics</h4>
                    <p>{visitorError}</p>
                  </div>
                ) : (
                  <div className="admin-overview-list">
                    <div>
                      <Eye />
                      <span>Total Visitors</span>
                      <strong>{visitorStats.totalVisitors}</strong>
                    </div>

                    <div>
                      <Users />
                      <span>Today's Visitors</span>
                      <strong>{visitorStats.todayVisitors}</strong>
                    </div>

                    <div>
                      <Activity />
                      <span>Users Online Now</span>
                      <strong style={{ color: '#16a34a' }}>
                        {visitorStats.onlineVisitors}
                      </strong>
                    </div>
                  </div>
                )}

                <button
                  onClick={fetchVisitors}
                  disabled={visitorLoading}
                  style={{
                    marginTop: '20px',
                    padding: '10px 18px',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#1769e8',
                    color: '#fff',
                    cursor: visitorLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <RefreshCw size={16} />
                  {visitorLoading ? 'Refreshing...' : 'Refresh Visitors'}
                </button>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h3>Quick Overview</h3>
                    <p>Conference management</p>
                  </div>

                  <LayoutDashboard />
                </div>

                <div className="admin-overview-list">
                  <div>
                    <Users />
                    <span>Author Registrations</span>
                    <strong>{totalRegistrations}</strong>
                  </div>

                  <div>
                    <FileText />
                    <span>Paper Submissions</span>
                    <strong>{totalPapers}</strong>
                  </div>

                  <div>
                    <Mail />
                    <span>Contact Messages</span>
                    <strong>{totalMessages}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleMenuClick('Messages')}
                  style={{
                    marginTop: '20px',
                    padding: '10px 18px',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#1769e8',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  View Messages
                </button>
              </div>
            </section>
          </>

        ) : activeMenu === 'Visitors' ? (

          /* VISITOR ANALYTICS */
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h3>Website Visitor Analytics</h3>
                <p>CONFERA 2027 live website traffic</p>
              </div>

              <Activity />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginTop: '25px'
            }}>
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><Eye /></div>
                <h3>{visitorStats.totalVisitors}</h3>
                <h4>Total Visitors</h4>
                <p>Unique website visitors</p>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon"><Users /></div>
                <h3>{visitorStats.todayVisitors}</h3>
                <h4>Today's Visitors</h4>
                <p>Unique visitors today</p>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon"><Activity /></div>
                <h3 style={{ color: '#16a34a' }}>
                  {visitorStats.onlineVisitors}
                </h3>
                <h4>Users Online Now</h4>
                <p>Active within last 2 minutes</p>
              </div>
            </div>

            {visitorError && (
              <p style={{ color: 'red', marginTop: '20px' }}>
                {visitorError}
              </p>
            )}

            <button
              onClick={fetchVisitors}
              disabled={visitorLoading}
              style={{
                marginTop: '25px',
                padding: '12px 22px',
                border: 'none',
                borderRadius: '9px',
                background: '#1769e8',
                color: 'white',
                cursor: visitorLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} />
              {visitorLoading ? 'Loading...' : 'Refresh Analytics'}
            </button>

            <p style={{
              marginTop: '20px',
              color: '#64748b',
              fontSize: '13px'
            }}>
              Visitor statistics refresh automatically every 30 seconds.
            </p>
          </section>

        ) : activeMenu === 'Registrations' ? (

          /* REGISTRATIONS */
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h3>Participant Registrations</h3>
                <p>CONFERA 2027 registered authors</p>
              </div>

              <Users />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              margin: '25px 0'
            }}>
              <h3 style={{ color: '#1769e8' }}>
                Total Registrations: {totalRegistrations}
              </h3>

              <button
                onClick={fetchParticipants}
                disabled={loading}
                style={{
                  padding: '11px 22px',
                  border: 'none',
                  borderRadius: '9px',
                  background: '#1769e8',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {loading ? (
              <div className="admin-empty-state">
                <Activity />
                <h4>Loading registrations...</h4>
              </div>
            ) : error ? (
              <div className="admin-empty-state">
                <h4>Unable to load registrations</h4>
                <p>{error}</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="admin-empty-state">
                <Users />
                <h4>No registrations found</h4>
                <p>Registered participants will appear here.</p>
              </div>
            ) : (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  minWidth: '1050px',
                  borderCollapse: 'collapse',
                  background: 'white'
                }}>
                  <thead>
                    <tr style={{ background: '#1769e8', color: 'white' }}>
                      {[
                        'ID',
                        'Name',
                        'Email',
                        'Alternate Email',
                        'Mobile',
                        'Institution',
                        'Country',
                        'Category',
                        'Presentation Type'
                      ].map(heading => (
                        <th key={heading} style={{
                          padding: '14px',
                          textAlign: 'left',
                          whiteSpace: 'nowrap'
                        }}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {participants.map(person => (
                      <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.full_name}</td>
                        <td>{person.email}</td>
                        <td>{person.alternate_email || '-'}</td>
                        <td>{person.mobile}</td>
                        <td>{person.institution}</td>
                        <td>{person.country}</td>
                        <td>{person.participant_category}</td>
                        <td>{person.presentation_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        ) : activeMenu === 'Paper Submissions' ? (

          /* PAPER SUBMISSIONS */
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h3>Research Paper Submissions</h3>
                <p>
                  All papers uploaded by CONFERA 2027 participants
                </p>
              </div>

              <FileText />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              margin: '25px 0'
            }}>
              <h3 style={{ color: '#1769e8' }}>
                Total Papers: {totalPapers}
              </h3>

              <button
                onClick={fetchPapers}
                disabled={paperLoading}
                style={{
                  padding: '11px 22px',
                  border: 'none',
                  borderRadius: '9px',
                  background: '#1769e8',
                  color: 'white',
                  cursor: paperLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} />
                {paperLoading ? 'Loading...' : 'Refresh Papers'}
              </button>
            </div>

            {paperLoading ? (
              <div className="admin-empty-state">
                <Activity />
                <h4>Loading paper submissions...</h4>
              </div>
            ) : paperError ? (
              <div className="admin-empty-state">
                <FileText />
                <h4>Unable to load papers</h4>
                <p>{paperError}</p>
              </div>
            ) : papers.length === 0 ? (
              <div className="admin-empty-state">
                <FileText />
                <h4>No paper submissions found</h4>
                <p>Uploaded research papers will appear here.</p>
              </div>
            ) : (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  minWidth: '850px',
                  borderCollapse: 'collapse',
                  background: 'white'
                }}>
                  <thead>
                    <tr style={{ background: '#1769e8', color: 'white' }}>
                      {[
                        'ID',
                        'Participant Name',
                        'Email Address',
                        'Paper File',
                        'Submitted Date',
                        'Download'
                      ].map(heading => (
                        <th key={heading} style={{
                          padding: '15px',
                          textAlign: 'left',
                          whiteSpace: 'nowrap'
                        }}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {papers.map(paper => (
                      <tr key={paper.id}>
                        <td style={{ padding: '14px' }}>{paper.id}</td>
                        <td style={{ padding: '14px' }}>
                          {paper.participant_name}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {paper.email}
                        </td>
                        <td style={{
                          padding: '14px',
                          maxWidth: '200px',
                          overflowWrap: 'anywhere'
                        }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px'
                          }}>
                            <FileText size={17} color="#1769e8" />
                            {paper.file_name}
                          </span>
                        </td>
                        <td style={{
                          padding: '14px',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatDate(paper.submitted_at)}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <button
                            type="button"
                            onClick={() => handleDownloadPaper(
                              paper.file_path,
                              paper.file_name
                            )}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '7px',
                              padding: '10px 15px',
                              border: 'none',
                              borderRadius: '7px',
                              background: '#1769e8',
                              color: '#fff',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Download size={16} />
                            Download Paper
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        ) : activeMenu === 'Conference' ? (

          /* CONFERENCE MANAGEMENT */
          <ConferenceManagement />

        ) : activeMenu === 'Messages' ? (

          /* CONTACT MESSAGES - DELETE FUNCTION PRESERVED */
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h3>Contact Messages</h3>
                <p>
                  Messages received from the CONFERA 2027 website
                </p>
              </div>

              <Mail />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              margin: '25px 0'
            }}>
              <h3 style={{ color: '#1769e8' }}>
                Total Messages: {totalMessages}
              </h3>

              <button
                onClick={fetchMessages}
                disabled={messageLoading}
                style={{
                  padding: '11px 22px',
                  border: 'none',
                  borderRadius: '9px',
                  background: '#1769e8',
                  color: 'white',
                  cursor: messageLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} />
                {messageLoading ? 'Loading...' : 'Refresh Messages'}
              </button>
            </div>

            {messageError && (
              <p style={{
                color: '#dc2626',
                marginBottom: '15px'
              }}>
                {messageError}
              </p>
            )}

            {messageLoading ? (
              <div className="admin-empty-state">
                <Activity />
                <h4>Loading contact messages...</h4>
              </div>
            ) : messages.length === 0 ? (
              <div className="admin-empty-state">
                <Mail />
                <h4>No contact messages found</h4>
                <p>
                  Messages submitted through your website
                  will appear here.
                </p>
              </div>
            ) : (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  minWidth: '1050px',
                  borderCollapse: 'collapse',
                  background: 'white'
                }}>
                  <thead>
                    <tr style={{ background: '#1769e8', color: 'white' }}>
                      {[
                        'ID',
                        'Sender Name',
                        'Email Address',
                        'Subject',
                        'Message',
                        'Status',
                        'Submitted Date',
                        'Action'
                      ].map(heading => (
                        <th key={heading} style={{
                          padding: '15px',
                          textAlign: 'left',
                          whiteSpace: 'nowrap'
                        }}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {messages.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '14px' }}>
                          {item.id}
                        </td>

                        <td style={{
                          padding: '14px',
                          fontWeight: '700'
                        }}>
                          {item.name}
                        </td>

                        <td style={{ padding: '14px' }}>
                          <a
                            href={`mailto:${item.email}`}
                            style={{
                              color: '#1769e8',
                              textDecoration: 'none'
                            }}
                          >
                            {item.email}
                          </a>
                        </td>

                        <td style={{
                          padding: '14px',
                          maxWidth: '180px',
                          overflowWrap: 'anywhere'
                        }}>
                          {item.subject || '-'}
                        </td>

                        <td style={{
                          padding: '14px',
                          minWidth: '220px',
                          maxWidth: '350px',
                          whiteSpace: 'pre-wrap',
                          overflowWrap: 'anywhere',
                          lineHeight: '1.6'
                        }}>
                          {item.message}
                        </td>

                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: '#fef3c7',
                            color: '#92400e',
                            fontSize: '12px',
                            fontWeight: '800'
                          }}>
                            Unread
                          </span>
                        </td>

                        <td style={{
                          padding: '14px',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatDate(item.created_at)}
                        </td>

                        {/* DELETE BUTTON - MESSAGES ONLY */}
                        <td style={{ padding: '14px' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(item.id)}
                            disabled={deletingMessageId === item.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '7px',
                              padding: '9px 14px',
                              border: 'none',
                              borderRadius: '7px',
                              background: '#dc2626',
                              color: '#fff',
                              cursor: deletingMessageId === item.id
                                ? 'not-allowed'
                                : 'pointer',
                              opacity: deletingMessageId === item.id
                                ? 0.6
                                : 1,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Trash2 size={16} />
                            {deletingMessageId === item.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p style={{
              marginTop: '20px',
              color: '#64748b',
              fontSize: '13px'
            }}>
              Messages refresh automatically every 30 seconds.
            </p>
          </section>

        ) : (
          <section className="admin-placeholder">
            <div className="admin-placeholder-icon">
              {menuItems.find(
                item => item.name === activeMenu
              )?.icon}
            </div>

            <h2>{activeMenu}</h2>

            <p>
              The {activeMenu} management section is ready
              for development and backend integration.
            </p>
          </section>
        )}

        {/* FOOTER */}
        <footer className="admin-footer">
          <span>© 2027 CONFERA. All Rights Reserved.</span>
          <span>Powered by DevSpectra</span>
        </footer>

      </main>
    </div>
  );
}

export default Admin;
