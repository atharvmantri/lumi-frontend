'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Background layers */}
      <div className="hero__bg-gradient" />
      <div className="hero__grid-overlay" />

      {/* Content */}
      <div className="hero__content">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="hero__badge-dot" />
          Now available for Windows
        </motion.div>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Zero friction.{' '}
          <span className="hero__title-accent">Just talk.</span>
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Lumi is a fully local, always-on AI voice assistant. GPU-accelerated,
          entirely private, and unrestricted.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <a href="#download" className="btn btn--primary" id="hero-download-btn">
            <span className="btn__icon">⬇</span>
            Download Lumi
          </a>
          <a href="#docs" className="btn btn--secondary" id="hero-docs-btn">
            <span className="btn__icon">📄</span>
            View Documentation
          </a>
        </motion.div>

        {/* Animated Orb */}
        <motion.div
          className="hero__orb-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__orb">
            <div className="hero__orb-ring" />
            <div className="hero__orb-ring hero__orb-ring--outer" />
          </div>
          <div className="hero__orb-particles">
            <div className="hero__orb-particle" />
            <div className="hero__orb-particle" />
            <div className="hero__orb-particle" />
            <div className="hero__orb-particle" />
            <div className="hero__orb-particle" />
            <div className="hero__orb-particle" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  );
}
