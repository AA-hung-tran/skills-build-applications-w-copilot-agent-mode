import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({
    user: '',
    type: '',
    duration: '',
    calories: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchActivities();
    fetchUsers();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/activities/`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_BASE}/activities/${currentActivity.id}/` : `${API_BASE}/activities/`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentActivity),
      });

      if (!response.ok) throw new Error('Failed to save activity');
      
      fetchActivities();
      setShowModal(false);
      setCurrentActivity({
        user: '',
        type: '',
        duration: '',
        calories: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (activity) => {
    setCurrentActivity(activity);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/activities/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete activity');
      fetchActivities();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Activities Log</h2>
            <button 
              className="btn btn-light"
              onClick={() => {
                setCurrentActivity({
                  user: '',
                  type: '',
                  duration: '',
                  calories: '',
                  date: new Date().toISOString().split('T')[0]
                });
                setIsEditing(false);
                setShowModal(true);
              }}
            >
              <i className="bi bi-plus-circle"></i> Log Activity
            </button>
          </div>
          <div className="card-body">
            {activities.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏃‍♂️</div>
                <p>No activities logged yet. Start tracking your workouts!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Type</th>
                      <th>Duration (min)</th>
                      <th>Calories</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.id}>
                        <td>{activity.id}</td>
                        <td>{getUserName(activity.user)}</td>
                        <td>
                          <span className="badge bg-success">{activity.type}</span>
                        </td>
                        <td>{activity.duration}</td>
                        <td>{activity.calories}</td>
                        <td>{new Date(activity.date).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleEdit(activity)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(activity.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit Activity' : 'Log New Activity'}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">User</label>
                    <select
                      className="form-select"
                      value={currentActivity.user}
                      onChange={(e) => setCurrentActivity({ ...currentActivity, user: e.target.value })}
                      required
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Activity Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentActivity.type}
                      onChange={(e) => setCurrentActivity({ ...currentActivity, type: e.target.value })}
                      required
                      placeholder="e.g., Running, Swimming, Yoga..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentActivity.duration}
                      onChange={(e) => setCurrentActivity({ ...currentActivity, duration: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Calories Burned</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentActivity.calories}
                      onChange={(e) => setCurrentActivity({ ...currentActivity, calories: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={currentActivity.date}
                      onChange={(e) => setCurrentActivity({ ...currentActivity, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update' : 'Log Activity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;
