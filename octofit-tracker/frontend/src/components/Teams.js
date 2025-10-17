import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({ name: '' });
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_BASE}/teams/`);
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_BASE}/teams/${currentTeam.id}/` : `${API_BASE}/teams/`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTeam),
      });

      if (!response.ok) throw new Error('Failed to save team');
      
      fetchTeams();
      setShowModal(false);
      setCurrentTeam({ name: '' });
      setIsEditing(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (team) => {
    setCurrentTeam(team);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/teams/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete team');
      fetchTeams();
    } catch (err) {
      alert('Error: ' + err.message);
    }
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
            <h2 className="mb-0">Teams Management</h2>
            <button 
              className="btn btn-light"
              onClick={() => {
                setCurrentTeam({ name: '' });
                setIsEditing(false);
                setShowModal(true);
              }}
            >
              <i className="bi bi-plus-circle"></i> Add Team
            </button>
          </div>
          <div className="card-body">
            {teams.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🦸‍♂️</div>
                <p>No teams found. Create your first team!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Team Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id}>
                        <td>{team.id}</td>
                        <td>
                          <span className={`badge bg-${team.name === 'Marvel' ? 'danger' : 'primary'} fs-6`}>
                            {team.name}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleEdit(team)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(team.id)}
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
                <h5 className="modal-title">{isEditing ? 'Edit Team' : 'Add New Team'}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Team Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentTeam.name}
                      onChange={(e) => setCurrentTeam({ ...currentTeam, name: e.target.value })}
                      required
                      placeholder="e.g., Marvel, DC, Avengers..."
                    />
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

export default Teams;
