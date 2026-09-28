import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const VerifyResetOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email not found. Please try again.");
      navigate("/forgot-password");
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/reset-password", {
          state: {
            email,
            otp,
          },
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("VERIFY RESET OTP ERROR:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify OTP</h2>

        <p>
          OTP sent to:
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value
                .replace(/\D/g, "")
                .slice(0, 6)
            )
          }
          maxLength="6"
          required
        />

        <button type="submit" className="btn">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyResetOtp;