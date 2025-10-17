import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState({
    name: '',
    description: '',
    suggested_for: []
  });
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchWorkouts();
    fetchTeams();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${API_BASE}/workouts/`);
      if (!response.ok) throw new Error('Failed to fetch workouts');
      const data = await response.json();
      setWorkouts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_BASE}/teams/`);
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_BASE}/workouts/${currentWorkout.id}/` : `${API_BASE}/workouts/`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentWorkout),
      });

      if (!response.ok) throw new Error('Failed to save workout');
      
      fetchWorkouts();
      setShowModal(false);
      setCurrentWorkout({ name: '', description: '', suggested_for: [] });
      setIsEditing(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (workout) => {
    setCurrentWorkout(workout);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/workouts/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete workout');
      fetchWorkouts();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const getTeamNames = (teamIds) => {
    if (!Array.isArray(teamIds)) return 'None';
    return teamIds.map(id => {
      const team = teams.find(t => t.id === id);
      return team ? team.name : 'Unknown';
    }).join(', ');
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
            <h2 className="mb-0">Workout Programs</h2>
            <button 
              className="btn btn-light"
              onClick={() => {
                setCurrentWorkout({ name: '', description: '', suggested_for: [] });
                setIsEditing(false);
                setShowModal(true);
              }}
            >
              <i className="bi bi-plus-circle"></i> Add Workout
            </button>
          </div>
          <div className="card-body">
            {workouts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💪</div>
                <p>No workouts available. Create your first workout program!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Suggested For</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map((workout) => (
                      <tr key={workout.id}>
                        <td>{workout.id}</td>
                        <td><strong>{workout.name}</strong></td>
                        <td>{workout.description}</td>
                        <td>
                          <span className="badge bg-info">
                            {getTeamNames(workout.suggested_for)}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleEdit(workout)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(workout.id)}
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
                <h5 className="modal-title">{isEditing ? 'Edit Workout' : 'Add New Workout'}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Workout Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentWorkout.name}
                      onChange={(e) => setCurrentWorkout({ ...currentWorkout, name: e.target.value })}
                      required
                      placeholder="e.g., Hero HIIT, Power Yoga..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={currentWorkout.description}
                      onChange={(e) => setCurrentWorkout({ ...currentWorkout, description: e.target.value })}
                      required
                      placeholder="Describe the workout..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Suggested For Teams</label>
                    <div>
                      {teams.map((team) => (
                        <div key={team.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`team-${team.id}`}
                            checked={currentWorkout.suggested_for.includes(team.id)}
                            onChange={(e) => {
                              const newTeams = e.target.checked
                                ? [...currentWorkout.suggested_for, team.id]
                                : currentWorkout.suggested_for.filter(id => id !== team.id);
                              setCurrentWorkout({ ...currentWorkout, suggested_for: newTeams });
                            }}
                          />
                          <label className="form-check-label" htmlFor={`team-${team.id}`}>
                            {team.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update' : 'Create'}
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

export default Workouts;
