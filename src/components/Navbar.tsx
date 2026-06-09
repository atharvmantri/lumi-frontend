'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('irm https://www.lumiassist.xyz/install.ps1 | iex');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

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
          <li><Link href="/docs/get-started" className="nav__link">Docs</Link></li>
        </ul>

        <button
          onClick={() => setIsModalOpen(true)}
          className="nav__cta"
          style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}
        >
          Get Lumi
        </button>
      </div>

      {/* Installation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              style={{
                background: 'var(--color-bg-secondary)',
                padding: 'var(--space-2xl)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '500px',
                width: '100%',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                color: 'var(--color-text-primary)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  padding: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>
                Install Lumi
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', lineHeight: 1.5 }}>
                Run the following command in your PowerShell terminal to download and start the setup process.
              </p>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--color-cyan-dim)', color: 'var(--color-cyan)', fontSize: '0.8rem'
                  }}>1</span>
                  Open PowerShell
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginLeft: '32px' }}>
                  Press <kbd style={{ background: 'var(--color-bg-primary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>Win + X</kbd> and select <strong>Terminal</strong> or <strong>Windows PowerShell</strong>.
                </p>
              </div>

              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--color-cyan-dim)', color: 'var(--color-cyan)', fontSize: '0.8rem'
                  }}>2</span>
                  Paste Command & Press Enter
                </div>

                <div style={{
                  marginLeft: '32px',
                  background: '#1d1d1f',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <code style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    irm https://www.lumiassist.xyz/install.ps1 | iex
                  </code>
                  <button
                    onClick={handleCopy}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
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
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
