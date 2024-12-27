import React, { useEffect, useState, useCallback } from 'react';
import '../css/LoginPage.css'; 
import googleIcon from '../images/google.png'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { auth, googleProvider } from './firebase'; 
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth'; 

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false); 
  const navigate = useNavigate();

  const redirectToLanding = useCallback((user) => {
    const displayName = user.displayName || user.email || "User"; 
    console.log('Navigating to landing page with user:', user);
    navigate('/editor', { state: { welcomeMessage: `Welcome, ${displayName}!` } });
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('User detected:', currentUser);
        setUser(currentUser); 
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email login successful:', result.user);
      redirectToLanding(result.user);
    } catch (error) {
      console.error('Email login failed:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login successful:', result.user);
      redirectToLanding(result.user); 
    } catch (error) {
      console.error('Google Login failed:', error);
      if (error.code === 'auth/popup-blocked') {
        setErrorMessage('Popup blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/network-request-failed') {
        setErrorMessage('Network error. Please check your connection.');
      } else {
        setErrorMessage('Google Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setErrorMessage('Logout failed. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMessage('Please enter your email to reset the password.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      setErrorMessage('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel" ></div>

      <div className="right-panel">
        <h2>Welcome Back!</h2>
        <p>Login to continue</p>

        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <>
            {!user ? (
              <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="remember-forgot">
                  <label>
                    <input type="checkbox" /> Remember me
                  </label>
                  <button 
                    type="button" 
                    onClick={handlePasswordReset} 
                    className="forgot-password-link"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleEmailLogin}
                  className="login-button"
                >
                  Login now
                </button>
              </form>
            ) : (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            )}

            <div className="login-options">
              <p>Or Login with</p>
              <button 
                className="google-login-button" 
                onClick={handleGoogleLogin}
              >
                <img src={googleIcon} alt="Google" className="google-icon" />
              </button>
              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </>
        )}

        {resetEmailSent && (
          <div className="success-message">
            Password reset email sent successfully! Check your inbox.
          </div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
