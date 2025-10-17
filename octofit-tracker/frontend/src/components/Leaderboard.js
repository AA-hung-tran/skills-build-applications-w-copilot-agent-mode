import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchLeaderboard();
    fetchTeams();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/leaderboards/`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();
      // Sort by points in descending order
      const sorted = data.sort((a, b) => b.points - a.points);
      setLeaderboard(sorted);
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

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankClass = (index) => {
    if (index === 0) return 'table-warning';
    if (index === 1) return 'table-secondary';
    if (index === 2) return 'table-info';
    return '';
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
          <div className="card-header">
            <h2 className="mb-0">🏆 Team Leaderboard</h2>
          </div>
          <div className="card-body">
            {leaderboard.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏆</div>
                <p>No leaderboard data available yet!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>Rank</th>
                      <th>Team</th>
                      <th>Points</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.id} className={getRankClass(index)}>
                        <td>
                          <h3 className="mb-0">{getRankIcon(index)}</h3>
                        </td>
                        <td>
                          <h5 className="mb-0">
                            <span className={`badge bg-${getTeamName(entry.team) === 'Marvel' ? 'danger' : 'primary'} fs-6`}>
                              {getTeamName(entry.team)}
                            </span>
                          </h5>
                        </td>
                        <td>
                          <h4 className="mb-0 text-primary">{entry.points.toLocaleString()}</h4>
                        </td>
                        <td>
                          <div className="progress" style={{ height: '30px' }}>
                            <div 
                              className={`progress-bar ${index === 0 ? 'bg-success' : 'bg-info'}`}
                              role="progressbar" 
                              style={{ width: `${(entry.points / Math.max(...leaderboard.map(e => e.points))) * 100}%` }}
                              aria-valuenow={entry.points} 
                              aria-valuemin="0" 
                              aria-valuemax={Math.max(...leaderboard.map(e => e.points))}
                            >
                              <strong>{entry.points}</strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {leaderboard.length > 0 && (
              <div className="mt-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="card-title">Leaderboard Stats</h5>
                    <div className="row text-center">
                      <div className="col-md-4">
                        <h6 className="text-muted">Total Points</h6>
                        <h3 className="text-primary">
                          {leaderboard.reduce((sum, entry) => sum + entry.points, 0).toLocaleString()}
                        </h3>
                      </div>
                      <div className="col-md-4">
                        <h6 className="text-muted">Leading Team</h6>
                        <h3 className="text-success">
                          {leaderboard.length > 0 ? getTeamName(leaderboard[0].team) : 'N/A'}
                        </h3>
                      </div>
                      <div className="col-md-4">
                        <h6 className="text-muted">Teams Competing</h6>
                        <h3 className="text-info">{leaderboard.length}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
