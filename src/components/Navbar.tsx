'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('irm lumiassist.xyz/install.ps1 | iex');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Switch to dark nav when past the hero section
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
        setScrolled(window.scrollY > heroBottom - 80);
      } else {
        setScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`nav ${scrolled ? 'scrolled' : 'nav--light'}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="nav__inner">
        <a href="#" className="nav__logo">
          <Image
            src="/logo-icon.png"
            alt="Lumi"
            width={28}
            height={28}
            className="nav__logo-img"
          />
          Lumi
        </a>

        <ul className="nav__links">
          <li><a href="#features" className="nav__link">Features</a></li>
          <li><a href="#tools" className="nav__link">Tools</a></li>
          <li><a href="#how-it-works" className="nav__link">How It Works</a></li>
          <li><a href="#privacy" className="nav__link">Privacy</a></li>
        </ul>

        <button 
          onClick={handleCopy}
          className="nav__cta" 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
          {copied ? 'Copied!' : 'Copy Install Command'}
        </button>
      </div>
    </motion.nav>
  );
}
