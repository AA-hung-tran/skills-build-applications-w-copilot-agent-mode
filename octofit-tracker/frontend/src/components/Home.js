import React from 'react';

function Home() {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h2 className="mb-0">Welcome to OctoFit Tracker 🏋️‍♀️</h2>
          </div>
          <div className="card-body">
            <p className="lead">
              Track your fitness journey with your team and compete on the leaderboard!
            </p>
            <hr />
            <div className="row mt-4">
              <div className="col-md-3 mb-3">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h3>👥</h3>
                    <h5>Users</h5>
                    <p className="mb-0">Manage superhero profiles</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h3>🦸‍♂️</h3>
                    <h5>Teams</h5>
                    <p className="mb-0">Marvel vs DC</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-info text-white">
                  <div className="card-body text-center">
                    <h3>🏃‍♂️</h3>
                    <h5>Activities</h5>
                    <p className="mb-0">Log your workouts</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h3>🏆</h3>
                    <h5>Leaderboard</h5>
                    <p className="mb-0">See who's winning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
