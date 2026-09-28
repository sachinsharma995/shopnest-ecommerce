import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Email verified successfully!');

        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);

      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={handleVerify}
        className="auth-form"
      >
        <h2>Verify Email</h2>

        <p>
          OTP sent to:
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          required
        />

        <button
          type="submit"
          className="btn"
        >
          Verify OTP
        </button>

        <p>
          Already verified?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#f97316',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;