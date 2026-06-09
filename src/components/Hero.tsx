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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <Image
          src="/logo-primary.png"
          alt="Lumi Logo"
          width={180}
          height={180}
          className="hero__logo-img"
          priority
        />
      </motion.div>

      {/* Content */}
      <div className="hero__content">
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          LUMI: The Open-Source, Integrated Windows AI.
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          A minimalist, responsive assistant that understands, thinks, and responds directly
          from your screen. Built by developers, for developers.
        </motion.p>

        {/* Desktop Mockup + Floating Elements */}
        <motion.div
          className="hero__showcase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="hero__mockup-frame">
            <Image
              src="/desktop-mockup.png"
              alt="Lumi AI assistant running on Windows desktop"
              width={1600}
              height={900}
              priority
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom center' }}
            />
          </div>

          {/* Floating Actions (Left) */}
          <div className="hero__floating-actions">
            <motion.a
              href="https://github.com/atharvmantri/lumi-assist"
              className="btn-floating"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              GET STARTED ON GITHUB
              <svg className="btn-floating__icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="btn-floating__badge">Open Source</span>
            </motion.a>
          </div>

          {/* Floating Features (Right) */}
          <motion.div
            className="hero__floating-features"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {features.map((feat, i) => (
              <div key={i} className="hero__feature-item">
                <span className="hero__feature-label">{feat.label}</span>
                <span className="hero__feature-desc">{feat.desc}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer Credit Line */}
        <motion.p
          className="hero__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          A project by Atharv Mantri. Forged with intelligence. Open for collaboration.
        </motion.p>
      </div>
    </section>
  );
}
