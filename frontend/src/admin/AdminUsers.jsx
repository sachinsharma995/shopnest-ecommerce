import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch('/api/auth/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await res.json();

        console.log('USERS API RESPONSE:', data);

        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchUsers();
    }
  }, [user]);

  // Get date from MongoDB ObjectId
  const getJoinedDate = (id) => {
    if (!id) {
      return 'N/A';
    }

    try {
      // Convert ObjectId to string
      const objectId = String(id);

      // MongoDB ObjectId must contain at least 8 hex characters
      if (objectId.length < 8) {
        return 'N/A';
      }

      // First 8 characters contain creation timestamp
      const timestamp = parseInt(
        objectId.substring(0, 8),
        16
      );

      // Convert seconds to milliseconds
      const date = new Date(timestamp * 1000);

      if (isNaN(date.getTime())) {
        return 'N/A';
      }

      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('DATE ERROR:', error);
      return 'N/A';
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>
        User Directory
      </h2>

      {loading && (
        <p style={messageStyle}>
          Loading users...
        </p>
      )}

      {error && (
        <p style={errorStyle}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={rowStyle}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>NAME</th>
                <th style={thStyle}>EMAIL</th>
                <th style={thStyle}>ROLE</th>
                <th style={thStyle}>JOINED</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u._id}
                    style={rowStyle}
                  >
                    {/* ID */}
                    <td style={tdStyle}>
                      {u._id
                        ? `${String(u._id).substring(0, 8)}...`
                        : 'N/A'}
                    </td>

                    {/* NAME */}
                    <td style={tdStyle}>
                      {u.name || 'N/A'}
                    </td>

                    {/* EMAIL */}
                    <td style={tdStyle}>
                      {u.email || 'N/A'}
                    </td>

                    {/* ROLE */}
                    <td style={tdStyle}>
                      <span
                        style={{
                          background:
                            u.role === 'admin'
                              ? 'rgba(234, 88, 12, 0.2)'
                              : 'rgba(16, 185, 129, 0.2)',

                          color:
                            u.role === 'admin'
                              ? '#f97316'
                              : '#10b981',

                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {u.role
                          ? u.role.toUpperCase()
                          : 'USER'}
                      </span>
                    </td>

                    {/* JOINED */}
                    <td style={tdStyle}>
                      {getJoinedDate(u._id)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: '30px',
                      textAlign: 'center',
                      color: '#a1a1aa',
                    }}
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ===============================
// STYLES
// ===============================

const containerStyle = {
  maxWidth: '1200px',
  margin: '40px auto',
  padding: '30px',
  background: '#18181b',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.05)',
  color: '#fafafa',
};

const headingStyle = {
  color: '#f97316',
  marginBottom: '20px',
  fontSize: '2rem',
  fontWeight: '700',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const rowStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};

const thStyle = {
  padding: '15px',
  textAlign: 'left',
  color: '#a1a1aa',
  fontSize: '0.9rem',
};

const tdStyle = {
  padding: '15px',
  textAlign: 'left',
};

const messageStyle = {
  color: '#a1a1aa',
  padding: '20px 0',
};

const errorStyle = {
  color: '#ef4444',
  padding: '20px 0',
};

export default AdminUsers;