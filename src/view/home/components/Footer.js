import React from 'react';
import '../Home.scss';

const Footer = (props) => {
  return (
    <div className="footer-content">
      <span>© 2020 Taste Of Asia Group Chopsticks</span>
      <div className="right-footer">
        <span>Terms & Conditions</span>|<span>Privacy Policy </span>|
        <span>Disclaimer</span>
      </div>
    </div>
  );
};

export default Footer;
