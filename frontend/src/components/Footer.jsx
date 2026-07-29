import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>Polymarket Clone</h2>
          <p>
            Trade on the future with real-time prediction markets.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/">Markets</a>
          <a href="/">Portfolio</a>
          <a href="/">Leaderboard</a>
        </div>

        <div className="footer-links">
          <h3>Resources</h3>

          <a href="/">Documentation</a>
          <a href="/">Help Center</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>

          <div className="social-icons">
            <a href="/">🌐</a>
            <a href="/">🐦</a>
            <a href="/">💼</a>
            <a href="/">📧</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Polymarket Clone | Built with React & Flask
      </div>
    </footer>
  );
};

export default Footer;