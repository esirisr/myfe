import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentList from './components/StudentList';
import AddStudentForm from './components/AddStudentForm';
import About from './components/About';
import Contacts from './components/Contacts';
import LoginPortal from './components/LoginPortal';
import { fetchStudents } from './services/fun';
import './app.css';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // --- Persistence & Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeSkill, setActiveSkill] = useState('All');
  const [activeLocation, setActiveLocation] = useState('All');

  // Check login status on page load
  useEffect(() => {
    const logged = localStorage.getItem('isLogged');
    if (logged === 'true') {
      setIsAuthenticated(true);
    }
    loadStudents();
  }, []);

  // Use this when LoginPortal verifies "admin" and "12345"
  const handleLogin = () => {
    localStorage.setItem('isLogged', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLogged');
    setIsAuthenticated(false);
  };

  const skills = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Painter'];

  const locations = useMemo(() => {
    const unique = [...new Set(students?.map(s => s.location) || [])];
    return ['All', ...unique];
  }, [students]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetchStudents();
      setStudents(res?.data || []);
    } catch (err) {
      console.error('Data loading failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = useMemo(() => {
    return students.filter(s => {
      const matchSkill = activeSkill === 'All' || s.skill === activeSkill;
      const matchLocation = activeLocation === 'All' || s.location === activeLocation;
      return matchSkill && matchLocation;
    });
  }, [activeSkill, activeLocation, students]);

  return (
    <Router>
      <div className="app-container">
        <header className="glass-nav">
          <div className="nav-content">
            <h1 className="brand-logo">Expert<span>at</span> Hub</h1>
            <nav className="main-nav">
              <Link to="/" className="nav-btn">Find Experts</Link>
              <Link to="/about" className="nav-btn">About</Link>
              <Link to="/contacts" className="nav-btn">Contacts</Link>
              
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout} 
                  className="nav-btn admin-glow" 
                  style={{border:'none', cursor:'pointer'}}
                >
                  Logout
                </button>
              ) : (
                <Link to="/admin" className="nav-btn admin-glow">Admin Panel</Link>
              )}
            </nav>
          </div>
        </header>

        <main className="content-area">
          <Routes>
            {/* User View: Experts List & Filters */}
            <Route path="/" element={
              <>
                <div className="filter-workspace">
                  <div className="filter-section">
                  
                    <div className="pill-group">
                      {skills.map(s => (
                        <button 
                          key={s} 
                          className={activeSkill === s ? 'pill active' : 'pill'} 
                          onClick={() => setActiveSkill(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section">
        
                    <div className="pill-group">
                      {locations.map(l => (
                        <button 
                          key={l} 
                          className={activeLocation === l ? 'pill active-loc' : 'pill'} 
                          onClick={() => setActiveLocation(l)}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <StudentList students={filteredProviders} loading={loading} isAdmin={false} />
              </>
            } />

            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />

            {/* Admin Route: Protected by LoginPortal */}
            <Route path="/admin" element={
              isAuthenticated ? (
                <div className="admin-layout animate-fade-in">
                  <AddStudentForm 
                    editingStudent={editingStudent} 
                    setEditingStudent={setEditingStudent} 
                    onSuccess={loadStudents} 
                  />
                  <div className="admin-divider" style={{margin:'40px 0', textAlign:'center', color:'var(--gray)'}}>
                    <span>Management Database</span>
                  </div>
                  <StudentList 
                    students={students} 
                    loading={loading} 
                    onRefresh={loadStudents} 
                    onEdit={setEditingStudent} 
                    isAdmin={true} 
                  />
                </div>
              ) : (
                <LoginPortal onLogin={handleLogin} />
              )
            } />
          </Routes>
        </main>

        <footer className="luxury-footer">
          <p>© 2026 Home Maintenance System | Agent 377 266</p>
        </footer>
      </div>
    </Router>
  );
}