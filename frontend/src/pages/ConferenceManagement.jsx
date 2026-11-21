
import { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays,
  Users,
  Clock,
  Megaphone,
  Save,
  Plus,
  Pencil,
  Trash2,
  RefreshCw
} from 'lucide-react';

const API = 'http://localhost:5000/api/conference';

const sections = [
  {
    key: 'dates',
    title: 'Important Dates',
    icon: CalendarDays,
    fields: [
      { name: 'event_name', label: 'Event Name', required: true },
      { name: 'event_date', label: 'Event Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  {
    key: 'speakers',
    title: 'Speakers',
    icon: Users,
    fields: [
      { name: 'name', label: 'Speaker Name', required: true },
      { name: 'designation', label: 'Designation' },
      { name: 'institution', label: 'Institution' },
      { name: 'photo_url', label: 'Photo URL' },
      { name: 'bio', label: 'Biography', type: 'textarea' }
    ]
  },
  {
    key: 'schedule',
    title: 'Conference Schedule',
    icon: Clock,
    fields: [
      { name: 'session_title', label: 'Session Title', required: true },
      { name: 'speaker_name', label: 'Speaker Name' },
      { name: 'session_date', label: 'Session Date', type: 'date' },
      { name: 'start_time', label: 'Start Time', type: 'time' },
      { name: 'end_time', label: 'End Time', type: 'time' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  {
    key: 'announcements',
    title: 'Announcements',
    icon: Megaphone,
    fields: [
      { name: 'title', label: 'Announcement Title', required: true },
      { name: 'content', label: 'Announcement Content', type: 'textarea', required: true }
    ]
  }
];

const emptyDetails = {
  title: '',
  theme: '',
  event_date: '',
  venue: '',
  description: ''
};

const emptyForms = {
  dates: {},
  speakers: {},
  schedule: {},
  announcements: {}
};

function ConferenceManagement() {
  const [details, setDetails] = useState(emptyDetails);
  const [records, setRecords] = useState({
    dates: [],
    speakers: [],
    schedule: [],
    announcements: []
  });

  const [forms, setForms] = useState(emptyForms);
  const [editing, setEditing] = useState({
    dates: null,
    speakers: null,
    schedule: null,
    announcements: null
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = () => localStorage.getItem('adminToken');

  const request = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
      localStorage.removeItem('adminDetails');
      window.location.href = '/admin';
      throw new Error('Admin login required');
    }

    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    });

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminDetails');
      window.location.href = '/admin';
      throw new Error('Your admin session has expired');
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [detailsData, ...sectionData] = await Promise.all([
        request('/details'),
        ...sections.map(section => request(`/${section.key}`))
      ]);

      const currentDetails = detailsData.details || emptyDetails;

      setDetails({
        ...emptyDetails,
        ...currentDetails,
        event_date: currentDetails.event_date
          ? String(currentDetails.event_date).slice(0, 10)
          : ''
      });

      const nextRecords = {};

      sections.forEach((section, index) => {
        nextRecords[section.key] = sectionData[index].data || [];
      });

      setRecords(nextRecords);

    } catch (err) {
      console.error('Conference Fetch Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetails(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const saveDetails = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await request('/details', {
        method: 'PUT',
        body: JSON.stringify(details)
      });

      setSuccess('Conference details saved successfully!');
      await fetchAll();

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (sectionKey, name, value) => {
    setForms(previous => ({
      ...previous,
      [sectionKey]: {
        ...previous[sectionKey],
        [name]: value
      }
    }));
  };

  const resetForm = (sectionKey) => {
    setForms(previous => ({
      ...previous,
      [sectionKey]: {}
    }));

    setEditing(previous => ({
      ...previous,
      [sectionKey]: null
    }));
  };

  const saveRecord = async (event, section) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const recordId = editing[section.key];

      await request(
        recordId
          ? `/${section.key}/${recordId}`
          : `/${section.key}`,
        {
          method: recordId ? 'PUT' : 'POST',
          body: JSON.stringify(forms[section.key])
        }
      );

      setSuccess(
        `${section.title} ${recordId ? 'updated' : 'added'} successfully!`
      );

      resetForm(section.key);
      await fetchAll();

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const editRecord = (section, item) => {
    const values = {};

    section.fields.forEach(field => {
      let value = item[field.name] ?? '';

      if (field.type === 'date' && value) {
        value = String(value).slice(0, 10);
      }

      if (field.type === 'time' && value) {
        value = String(value).slice(0, 5);
      }

      values[field.name] = value;
    });

    setForms(previous => ({
      ...previous,
      [section.key]: values
    }));

    setEditing(previous => ({
      ...previous,
      [section.key]: item.id
    }));

    document.getElementById(`conference-${section.key}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const deleteRecord = async (section, id) => {
    if (!window.confirm(`Delete this ${section.title} record permanently?`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');

      await request(`/${section.key}/${id}`, {
        method: 'DELETE'
      });

      setSuccess(`${section.title} record deleted successfully!`);
      await fetchAll();

    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';

    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString();
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 13px',
    border: '1px solid #dbe2ea',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    background: '#fff'
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    background: '#1769e8',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600'
  };

  return (
    <div style={{ display: 'grid', gap: '25px' }}>

      {/* PAGE INTRODUCTION */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Conference Management</h3>
            <p>Manage all CONFERA 2027 conference information</p>
          </div>
          <CalendarDays />
        </div>

        <button
          type="button"
          onClick={fetchAll}
          disabled={loading}
          style={{ ...buttonStyle, marginTop: '20px' }}
        >
          <RefreshCw size={16} />
          {loading ? 'Loading...' : 'Refresh Conference Data'}
        </button>
      </section>

      {error && (
        <div style={{
          padding: '13px 16px',
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '13px 16px',
          background: '#dcfce7',
          color: '#166534',
          borderRadius: '8px'
        }}>
          {success}
        </div>
      )}

      {/* CONFERENCE DETAILS */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Conference Details</h3>
            <p>Update the main conference information</p>
          </div>
          <CalendarDays />
        </div>

        <form onSubmit={saveDetails} style={{ marginTop: '22px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '17px'
          }}>
            {[
              { name: 'title', label: 'Conference Title', required: true },
              { name: 'theme', label: 'Conference Theme' },
              { name: 'event_date', label: 'Event Date', type: 'date' },
              { name: 'venue', label: 'Venue' }
            ].map(field => (
              <label key={field.name} style={{ display: 'grid', gap: '8px' }}>
                <strong>{field.label}</strong>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={details[field.name] || ''}
                  onChange={handleDetailsChange}
                  required={field.required}
                  style={inputStyle}
                />
              </label>
            ))}
          </div>

          <label style={{
            display: 'grid',
            gap: '8px',
            marginTop: '17px'
          }}>
            <strong>Conference Description</strong>
            <textarea
              name="description"
              value={details.description || ''}
              onChange={handleDetailsChange}
              rows="4"
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            style={{ ...buttonStyle, marginTop: '18px' }}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Conference Details'}
          </button>
        </form>
      </section>

      {/* OTHER CONFERENCE SECTIONS */}
      {sections.map(section => {
        const Icon = section.icon;
        const items = records[section.key] || [];
        const isEditing = editing[section.key] !== null;

        return (
          <section
            className="admin-panel"
            key={section.key}
            id={`conference-${section.key}`}
          >
            <div className="admin-panel-heading">
              <div>
                <h3>{section.title}</h3>
                <p>Manage {section.title.toLowerCase()} for CONFERA 2027</p>
              </div>
              <Icon />
            </div>

            {/* ADD / EDIT FORM */}
            <form
              onSubmit={event => saveRecord(event, section)}
              style={{ marginTop: '22px' }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '17px'
              }}>
                {section.fields.map(field => (
                  <label
                    key={field.name}
                    style={{
                      display: 'grid',
                      gap: '8px',
                      gridColumn: field.type === 'textarea'
                        ? '1 / -1'
                        : 'auto'
                    }}
                  >
                    <strong>{field.label}</strong>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows="3"
                        value={forms[section.key][field.name] || ''}
                        onChange={event => handleFormChange(
                          section.key,
                          field.name,
                          event.target.value
                        )}
                        required={field.required}
                        style={inputStyle}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={forms[section.key][field.name] || ''}
                        onChange={event => handleFormChange(
                          section.key,
                          field.name,
                          event.target.value
                        )}
                        required={field.required}
                        style={inputStyle}
                      />
                    )}
                  </label>
                ))}
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginTop: '18px'
              }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={buttonStyle}
                >
                  {isEditing ? <Save size={16} /> : <Plus size={16} />}
                  {saving
                    ? 'Saving...'
                    : isEditing
                      ? 'Update Record'
                      : 'Add Record'}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => resetForm(section.key)}
                    style={{
                      ...buttonStyle,
                      background: '#64748b'
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* RECORDS TABLE */}
            <div style={{
              width: '100%',
              overflowX: 'auto',
              marginTop: '28px'
            }}>
              {loading ? (
                <p>Loading {section.title.toLowerCase()}...</p>
              ) : items.length === 0 ? (
                <p style={{ color: '#64748b' }}>
                  No {section.title.toLowerCase()} added yet.
                </p>
              ) : (
                <table style={{
                  width: '100%',
                  minWidth: '650px',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      background: '#1769e8',
                      color: '#fff'
                    }}>
                      <th style={{ padding: '13px', textAlign: 'left' }}>
                        ID
                      </th>

                      {section.fields.map(field => (
                        <th
                          key={field.name}
                          style={{
                            padding: '13px',
                            textAlign: 'left',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {field.label}
                        </th>
                      ))}

                      <th style={{ padding: '13px', textAlign: 'left' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '13px' }}>{item.id}</td>

                        {section.fields.map(field => (
                          <td
                            key={field.name}
                            style={{
                              padding: '13px',
                              maxWidth: '240px',
                              overflowWrap: 'anywhere'
                            }}
                          >
                            {field.type === 'date'
                              ? formatDate(item[field.name])
                              : item[field.name] || '-'}
                          </td>
                        ))}

                        <td style={{
                          padding: '13px',
                          whiteSpace: 'nowrap'
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: '8px'
                          }}>
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => editRecord(section, item)}
                              style={{
                                ...buttonStyle,
                                padding: '8px',
                                background: '#0d9488'
                              }}
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              title="Delete"
                              onClick={() => deleteRecord(section, item.id)}
                              style={{
                                ...buttonStyle,
                                padding: '8px',
                                background: '#dc2626'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default ConferenceManagement;
