import React from "react";
import {
  FaGlobe,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const About = () => {
  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px",
    background: "#18181b",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    textAlign: "center",
  };

  const socialBtnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "#27272a",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  return (
    <div style={containerStyle}>
      <img
        src="/dp.jpg"
        alt="@thesachinsharma"
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "4px solid #f97316",
          marginBottom: "20px",
          boxShadow: "0 4px 20px rgba(249, 115, 22, 0.4)",
        }}
      />
      <h2 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#fff" }}>
        About Me
      </h2>
      <h3
        style={{ fontSize: "1.5rem", color: "#f97316", marginBottom: "15px" }}
      >
        Sachin Sharma (@thesachinsharma)
      </h3>

      <p
        style={{
          color: "#a1a1aa",
          fontSize: "1.2rem",
          lineHeight: "1.8",
          maxWidth: "600px",
          margin: "0 auto 30px auto",
        }}
      >
        <strong>Join the community and grow together!</strong> Welcome to my
        platform where we build, deploy, and scale highly engineered systems.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <a
          href="https://theshivanshvasu.com"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          <FaGlobe size={18} /> Website
        </a>

        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(239, 68, 68, 0.2)",
            borderColor: "#ef4444",
            color: "#ef4444",
          }}
        >
          <FaYoutube size={18} /> YouTube
        </a>

        <a
          href="https://www.instagram.com/iamsachin_sharmaa"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(236, 72, 153, 0.2)",
            borderColor: "#ec4899",
            color: "#ec4899",
          }}
        >
          <FaInstagram size={18} /> Instagram
        </a>

        <a
          href="https://www.linkedin.com/in/sachin-sharma-163308322/"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(59, 130, 246, 0.2)",
            borderColor: "#3b82f6",
            color: "#3b82f6",
          }}
        >
          <FaLinkedin size={18} /> LinkedIn
        </a>

        <a
          href="https://x.com/SachinS75985951"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          <FaXTwitter size={18} /> X (Twitter)
        </a>

        <a
          href="https://github.com/sachinsharma995"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(16, 185, 129, 0.2)",
            borderColor: "#10b981",
            color: "#10b981",
          }}
        >
          <FaGithub size={18} /> GitHub
        </a>
      </div>
    </div>
  );
};

export default About;
