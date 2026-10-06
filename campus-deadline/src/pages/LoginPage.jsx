import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FlameIcon,
  AlertTriangleIcon,
  ClockIcon,
  FriendsIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  UserIcon,
} from '../components/Icons';

/**
 * Pre-configured demo student personas for rapid evaluation during judging
 */
const DEMO_PERSONAS = [
  {
    id: 'shivam',
    name: 'Shivam Sharma',
    username: '@shivam_s',
    email: 'shivam.sharma@campus.edu',
    role: 'CS Undergrad · Year 3',
    avatar: 'S',
    badge: '3 Collisions · 7d Streak',
    description: 'Primary senior persona with active clustered deliverables & team projects.',
  },
  {
    id: 'riya',
    name: 'Riya Singh',
    username: '@riya_s',
    email: 'riya.singh@campus.edu',
    role: 'Data Science · Year 2',
    avatar: 'R',
    badge: 'Study Circle Teammate',
    description: 'Junior peer collaborating on the DBMS Group Assignment.',
  },
  {
    id: 'evaluator',
    name: 'Spectra Evaluator',
    username: '@evaluator_2026',
    email: 'evaluator@spectra2026.edu',
    role: 'Jury & Mentor Evaluation',
    avatar: 'E',
    badge: 'Hackathon Judge Mode',
    description: 'Guest evaluator testing frictionless flow and user experience.',
  },
];

/**
 * LoginPage - Frictionless Demo Authentication for Spectra 2026
 * Allows judges and evaluators to sign in with zero setup or passwords,
 * test multiple student identities, and easily sign out.
 */
function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('shivam.sharma@campus.edu');
  const [password, setPassword] = useState('demo123');
  const [selectedPersonaId, setSelectedPersonaId] = useState('shivam');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle standard form sign-in (accepts any credentials for demo)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const persona = DEMO_PERSONAS.find((p) => p.id === selectedPersonaId) || {
      name: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Campus Student',
      email: email,
      username: `@${email.split('@')[0]}`,
      role: 'Student · Spectra 2026',
      avatar: email.charAt(0).toUpperCase() || 'S',
    };

    setTimeout(() => {
      login({
        name: persona.name,
        email: email || persona.email,
        username: persona.username,
        role: persona.role,
        avatar: persona.avatar,
      });
      setIsSubmitting(false);
    }, 250);
  };

  // Instant 1-click persona sign-in
  const handleQuickLogin = (persona) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login({
        name: persona.name,
        email: persona.email,
        username: persona.username,
        role: persona.role,
        avatar: persona.avatar,
      });
      setIsSubmitting(false);
    }, 150);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-wrapper">
            <img src="/logo.png" alt="DEADLINEO Brand Logo" className="login-logo-img" />
          </div>
          <h1 className="login-title">DEADLINEO</h1>
          <p className="login-subtitle">
            Academic Early-Warning & Collision Engine
          </p>
          <div className="login-event-tag">
            Full Spectrum – Spectra 2026 Prototype
          </div>
        </div>

        {/* Main Authentication Card */}
        <div className="login-card">
          {/* Demo Callout Banner */}
          <div className="login-demo-banner">
            <div className="login-demo-banner-icon">🚀</div>
            <div className="login-demo-banner-text">
              <strong>Frictionless Demo Mode:</strong> No account or backend required.
              Sign in with any email or select an instant student identity below.
            </div>
          </div>

          {/* Sign In Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email-input">
                Campus Email Address
              </label>
              <input
                id="login-email-input"
                type="email"
                className="form-input"
                placeholder="e.g. yourname@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="login-password-label-row">
                <label className="form-label" htmlFor="login-password-input">
                  Password
                </label>
                <span className="login-label-hint">Any password accepted</span>
              </div>
              <input
                id="login-password-input"
                type="password"
                className="form-input"
                placeholder="Enter password (demo mode)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="login-form-options">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember session in browser</span>
              </label>
              <span className="login-privacy-pill">
                🔒 Safe Demo
              </span>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block btn--lg login-submit-btn"
              id="login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Entering DEADLINEO...'
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Personas */}
          <div className="login-quick-section">
            <div className="login-divider">
              <span>OR 1-CLICK INSTANT DEMO ACCESS</span>
            </div>

            <div className="login-personas-grid">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  className={`login-persona-card ${
                    selectedPersonaId === persona.id ? 'login-persona-card--active' : ''
                  }`}
                  onClick={() => {
                    setSelectedPersonaId(persona.id);
                    setEmail(persona.email);
                    handleQuickLogin(persona);
                  }}
                  id={`demo-user-${persona.id}`}
                >
                  <div className="login-persona-avatar">
                    {persona.avatar}
                  </div>
                  <div className="login-persona-info">
                    <div className="login-persona-header">
                      <span className="login-persona-name">{persona.name}</span>
                      <span className="login-persona-badge">{persona.badge}</span>
                    </div>
                    <div className="login-persona-role">{persona.role}</div>
                    <div className="login-persona-desc">{persona.description}</div>
                  </div>
                  <div className="login-persona-arrow">
                    →
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Engine Highlights Preview */}
          <div className="login-features-preview">
            <div className="login-feature-pill">
              <span className="login-feature-icon">⚡</span>
              <span>48h Collision Radar</span>
            </div>
            <div className="login-feature-pill">
              <span className="login-feature-icon">🎯</span>
              <span>Smart DO NOW / DO NEXT Priority</span>
            </div>
            <div className="login-feature-pill">
              <span className="login-feature-icon">🤝</span>
              <span>Study Circle Sync</span>
            </div>
            <div className="login-feature-pill">
              <span className="login-feature-icon">🔥</span>
              <span>On-Time Streaks</span>
            </div>
          </div>
        </div>

        {/* Demo Footer */}
        <div className="login-footer">
          <p>
            DEADLINEO early-warning prototype · Full Spectrum 2026 Group Build Event
          </p>
          <p className="login-footer-sub">
            Built by Seniors & Juniors · Client-side persistence via LocalStorage
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
