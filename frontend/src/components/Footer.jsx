import "../styles/components/footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-logo">ProGuide</h2>
          <p>
            Connecting students with experienced professionals for better career guidance.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/search">Find Professionals</Link>
          <Link to="/become-professional">Become a Professional</Link>
          <Link to="/about">About</Link>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@proguide.com</p>
          <p>Location: India</p>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ProGuide. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;