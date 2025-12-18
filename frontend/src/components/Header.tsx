import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Home, FolderKanban, CheckSquare, MessageSquare, LogOut, User, Users, GitBranch } from 'lucide-react';
import './Header.css';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <FolderKanban className="logo-icon" />
          <span className="logo-text">Reader</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">
                <Home className="nav-icon" />
                <span>Home</span>
              </Link>
              <Link to="/projects" className="nav-link">
                <FolderKanban className="nav-icon" />
                <span>Projects</span>
              </Link>
              <Link to="/tasks" className="nav-link">
                <CheckSquare className="nav-icon" />
                <span>Tasks</span>
              </Link>
              <Link to="/comments" className="nav-link">
                <MessageSquare className="nav-icon" />
                <span>Comments</span>
              </Link>
              <Link to="/hierarchy" className="nav-link">
                <GitBranch className="nav-icon" />
                <span>Hierarchy</span>
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/users" className="nav-link">
                  <Users className="nav-icon" />
                  <span>Users</span>
                </Link>
              )}
              <div className="user-menu">
                <User className="user-icon" />
                <span className="user-name">{user?.username}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <LogOut className="nav-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-link">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`header-nav mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <Home className="nav-icon" />
              <span>Home</span>
            </Link>
            <Link to="/projects" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FolderKanban className="nav-icon" />
              <span>Projects</span>
            </Link>
            <Link to="/tasks" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <CheckSquare className="nav-icon" />
              <span>Tasks</span>
            </Link>
            <Link to="/comments" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <MessageSquare className="nav-icon" />
              <span>Comments</span>
            </Link>
            <Link to="/hierarchy" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <GitBranch className="nav-icon" />
              <span>Hierarchy</span>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/users" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <Users className="nav-icon" />
                <span>Users</span>
              </Link>
            )}
            <div className="user-menu mobile">
              <User className="user-icon" />
              <div>
                <div className="user-name">{user?.username}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="nav-link logout-btn">
              <LogOut className="nav-icon" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="nav-link register-link" onClick={() => setIsMobileMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

