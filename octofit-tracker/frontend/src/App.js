import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import Home from './components/Home';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/" onClick={() => setActiveTab('home')}>
              <span className="octo-icon">🐙</span>
              OctoFit Tracker
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} 
                    to="/"
                    onClick={() => setActiveTab('home')}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} 
                    to="/users"
                    onClick={() => setActiveTab('users')}
                  >
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`} 
                    to="/teams"
                    onClick={() => setActiveTab('teams')}
                  >
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${activeTab === 'activities' ? 'active' : ''}`} 
                    to="/activities"
                    onClick={() => setActiveTab('activities')}
                  >
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${activeTab === 'workouts' ? 'active' : ''}`} 
                    to="/workouts"
                    onClick={() => setActiveTab('workouts')}
                  >
                    Workouts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${activeTab === 'leaderboard' ? 'active' : ''}`} 
                    to="/leaderboard"
                    onClick={() => setActiveTab('leaderboard')}
                  >
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
