'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    label: 'Seamless Integration:',
    desc: 'Native taskbar localization.',
  },
  {
    label: 'Ambient Feedback:',
    desc: 'Glowing waveforms and particle fields.',
  },
  {
    label: 'Minimal Footprint:',
    desc: '<1/10th screen coverage.',
  },
  {
    label: 'Developer-Ready:',
    desc: 'Fork, build, and customize.',
  },
];

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Logo */}
      <motion.div
        className="hero__logo-wrap"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <Image
          src="/logo-primary.png"
          alt="Lumi Logo"
          width={80}
          height={80}
          className="hero__logo-img"
          priority
        />
      </motion.div>

      {/* Content */}
      <div className="hero__content">
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          LUMI: The Open-Source, Integrated Windows AI.
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          A minimalist, responsive assistant that understands, thinks, and responds directly
          from your screen. Built by developers, for developers.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <a href="https://github.com" className="btn-hero" id="hero-github-btn" target="_blank" rel="noopener noreferrer">
            GET STARTED ON GITHUB
            <span className="btn-hero__badge">Open Source</span>
          </a>
          <a href="#demo" className="btn-hero btn-hero--secondary" id="hero-demo-btn">
            VIEW UI DEMO
          </a>
        </motion.div>

        {/* Desktop Mockup + Features */}
        <motion.div
          className="hero__showcase"
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__mockup-wrap">
            <div className="hero__mockup-frame">
              <Image
                src="/desktop-mockup.png"
                alt="Lumi AI assistant running on Windows desktop with glowing waveform visualization"
                width={900}
                height={900}
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>

          <div className="hero__features-sidebar">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                className="hero__feature-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
              >
                <span className="hero__feature-label">{feat.label}</span>
                <span className="hero__feature-desc">{feat.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="hero__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          A project by Atharv Mantri. Forged with intelligence. Open for collaboration.
        </motion.p>
      </div>

      <div className="hero__transition" />
    </section>
  );
}
