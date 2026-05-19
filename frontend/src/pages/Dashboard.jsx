import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'PENDING' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchTasks = async () => {
    const res = await api.get('/tasks');
    setTasks(res.data.data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, form);
        setMessage('Task updated!');
        setEditId(null);
      } else {
        await api.post('/tasks', form);
        setMessage('Task created!');
      }
      setForm({ title: '', description: '', status: 'PENDING' });
      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setForm({ title: task.title, description: task.description || '', status: task.status });
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setMessage('Task deleted!');
    fetchTasks();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user?.name} ({user?.role})</h2>
        <button onClick={logout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3>{editId ? 'Edit Task' : 'New Task'}</h3>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          required style={inputStyle} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          style={inputStyle} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button type="submit" style={btnStyle}>{editId ? 'Update' : 'Create'} Task</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', description: '', status: 'PENDING' }); }}
          style={{ ...btnStyle, background: '#6b7280', marginLeft: '8px' }}>Cancel</button>}
      </form>

      <div>
        {tasks.length === 0 && <p>No tasks yet. Create one!</p>}
        {tasks.map(task => (
          <div key={task.id} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0 }}>{task.title}</h4>
                <p style={{ margin: '4px 0', color: '#6b7280' }}>{task.description}</p>
                <span style={{ background: task.status === 'DONE' ? '#d1fae5' : task.status === 'IN_PROGRESS' ? '#fef3c7' : '#e5e7eb', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>
                  {task.status}
                </span>
              </div>
              <div>
                <button onClick={() => handleEdit(task)} style={{ ...btnStyle, padding: '6px 12px', marginRight: '6px' }}>Edit</button>
                <button onClick={() => handleDelete(task.id)} style={{ ...btnStyle, background: '#ef4444', padding: '6px 12px' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', margin: '6px 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle = { padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };