import React, { useState } from 'react';
import '../css/SignUpPage.css';
import { useNavigate } from 'react-router-dom';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail, 
  googleProvider, 
  signInWithPopup, 
  db, // Firestore import
  setDoc, 
  doc 
} from './firebase'; // Firebase utilities

const SignUpPage = () => {
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const storeUserDetails = async (uid) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        fullName,
        email,
      });
      console.log('User details stored successfully.');
    } catch (error) {
      console.error('Error storing user details:', error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.includes('google.com')) {
        setError('This email is registered with Google. Please log in using Google.');
        await handleGoogleLogin();
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await storeUserDetails(userCredential.user.uid);

      navigate('/landing');
    } catch (error) {
      console.error('Sign-up error:', error.message);
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate('/landing');
    } catch (error) {
      console.error('Google sign-in error:', error.message);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="left-panel"></div>
      <div className="right-panel">
        <h2>We is here to help you!</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="fullName">Full Name</label>
          <input 
            type="text" 
            id="fullName" 
            placeholder="Full Name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-button">Register Account</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
