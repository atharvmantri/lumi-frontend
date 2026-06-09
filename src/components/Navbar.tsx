'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`nav ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="nav__inner">
        <a href="#" className="nav__logo">
          <span className="nav__logo-dot" />
          Lumi
        </a>

        <ul className="nav__links">
          <li><a href="#features" className="nav__link">Features</a></li>
          <li><a href="#tools" className="nav__link">Tools</a></li>
          <li><a href="#how-it-works" className="nav__link">How It Works</a></li>
          <li><a href="#privacy" className="nav__link">Privacy</a></li>
        </ul>

        <a href="#download" className="nav__cta">
          Download
        </a>
      </div>
    </motion.nav>
  );
}
