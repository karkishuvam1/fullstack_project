import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

async function fetchUsers() {
  try {
    const { data } = await api.get('/admin/users');
    return data;
  } catch (_) {
    return [];
  }
}

function RoleBadge({ role }) {
  const isAdmin = role === 'admin';
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25rem 0.65rem',
      background: isAdmin ? 'rgba(229,184,0,0.12)' : 'rgba(92,122,94,0.08)',
      border: `1px solid ${isAdmin ? 'rgba(229,184,0,0.4)' : 'rgba(92,122,94,0.3)'}`,
      color: isAdmin ? '#e5b800' : '#5c7a5e',
      fontSize: '0.62rem',
      fontFamily: "'Space Grotesk', sans-serif",
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontWeight: 700,
    }}>{role}</span>
  );
}

function ManageUsers() {
  const { data: users = [], loading, refetch } = useFetch(fetchUsers, []);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(null);

  const filtered = (users || []).filter((u) => {
    const matchRole = filter === 'all' || u.role === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const openEdit = (u) => { setSelectedUser(u); setOpen(true); };

  const changeRole = async (u, role) => {
    setUpdating(u._id);
    try {
      await api.put(`/admin/users/${u._id}/role`, { role });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setUpdating(null);
    }
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Delete user ${u.name} <${u.email}>?`)) return;
    setUpdating(u._id);
    try {
      await api.delete(`/admin/users/${u._id}`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em',
            color: '#a1a1a1', fontWeight: 500, marginBottom: '0.25rem',
          }}>
            Directory
          </h3>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.35rem', textTransform: 'uppercase' }}>
            Manage Users
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            style={{
              background: '#000', border: '1px solid #222',
              padding: '0.5rem 0.8rem', color: '#fff',
              fontSize: '0.8rem', outline: 'none', minWidth: '220px',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#e5b800')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
          />
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {['all', 'user', 'admin'].map((r) => (
              <button key={r} onClick={() => setFilter(r)}
                style={{
                  padding: '0.5rem 0.8rem',
                  background: filter === r ? '#e5b800' : 'transparent',
                  border: `1px solid ${filter === r ? '#e5b800' : '#222'}`,
                  color: filter === r ? '#000' : '#ccc',
                  textTransform: 'uppercase',
                  fontSize: '0.65rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}>{r}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div style={{
          background: '#0d0d0d',
          border: '1px solid #222',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#050505', borderBottom: '1px solid #222' }}>
                  {['', 'Name', 'Email', 'Role', 'Created', 'Orders', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '0.85rem 1rem', textAlign: 'left',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                      color: '#a1a1a1', fontWeight: 500,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: '3rem 2rem', textAlign: 'center', color: '#a1a1a1' }}>
                      No users match your search.
                    </td>
                  </tr>
                )}
                {filtered.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #1a1a1a' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,184,0,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #e5b800, #c06a52)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 800, color: '#111',
                      }}>{u.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.name}</p>
                      <p style={{ fontSize: '0.7rem', color: '#a1a1a1' }}>
                        ID: {u._id?.slice(-8)}
                      </p>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <RoleBadge role={u.role || 'user'} />
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#a1a1a1' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                      —
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <button onClick={() => openEdit(u)}
                          disabled={updating === u._id}
                          style={{
                            background: 'transparent', border: '1px solid #222',
                            color: '#ccc', padding: '0.4rem 0.75rem',
                            fontSize: '0.7rem', fontFamily: "'Space Grotesk', sans-serif",
                            textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e5b800'; e.currentTarget.style.color = '#e5b800'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#ccc'; }}
                        >
                          View
                        </button>
                        <button onClick={() => changeRole(u, u.role === 'admin' ? 'user' : 'admin')}
                          disabled={updating === u._id}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${u.role === 'admin' ? 'rgba(229,184,0,0.4)' : '#2a2a2a'}`,
                            color: u.role === 'admin' ? '#e5b800' : '#888',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.7rem', fontFamily: "'Space Grotesk', sans-serif",
                            textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e5b800'; e.currentTarget.style.color = '#e5b800'; }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = u.role === 'admin' ? 'rgba(229,184,0,0.4)' : '#2a2a2a';
                            e.currentTarget.style.color = u.role === 'admin' ? '#e5b800' : '#888';
                          }}
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button onClick={() => removeUser(u)}
                          disabled={updating === u._id}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(192,106,82,0.4)',
                            color: '#c06a52',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.7rem', fontFamily: "'Space Grotesk', sans-serif",
                            textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192,106,82,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={open}
        onClose={() => setUpdating(null) || setOpen(false)}
        title="User Details"
        maxWidth="520px"
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #222' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #e5b800, #c06a52)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.75rem', fontWeight: 800, color: '#111',
              }}>{selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedUser.name}
                </p>
                <p style={{ fontSize: '0.82rem', color: '#a1a1a1' }}>{selectedUser.email}</p>
                <div style={{ marginTop: '0.4rem' }}>
                  <RoleBadge role={selectedUser.role || 'user'} />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <InfoCell label="User ID" value={selectedUser._id?.slice(-10).toUpperCase()} />
              <InfoCell label="Joined" value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '—'} />
            </div>
            <div style={{ padding: '0.85rem', background: '#050505', border: '1px solid #222' }}>
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a1a1a1', marginBottom: '0.5rem' }}>
                Quick Actions
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button size="sm" variant="secondary" onClick={() => changeRole(selectedUser, selectedUser.role === 'admin' ? 'user' : 'admin')}>
                  {selectedUser.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => { if (confirm('Delete this user?')) { removeUser(selectedUser); setOpen(false); } }}
                >
                  Delete User
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div style={{ padding: '0.75rem', background: '#050505', border: '1px solid #222' }}>
      <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a1a1a1', marginBottom: '0.25rem' }}>{label}</p>
      <p style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '0.82rem' }}>{value}</p>
    </div>
  );
}

export default ManageUsers;
