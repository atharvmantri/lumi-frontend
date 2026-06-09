'use client';

import { motion } from 'framer-motion';

const privacyFeatures = [
  'Zero cloud dependency',
  'No telemetry or tracking',
  'Open-source models',
  'Offline capable',
];

export default function Privacy() {
  return (
    <section className="section privacy" id="privacy">
      <div className="container">
        <motion.div
          className="privacy__card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="privacy__icon"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            🛡️
          </motion.div>

          <h2 className="privacy__title">
            Privacy <span className="gradient-text">first</span>
          </h2>
          <p className="privacy__desc">
            Your audio never leaves your machine. Lumi processes everything
            locally — from speech recognition to AI reasoning to voice
            synthesis. Total privacy, total security.
          </p>

          <motion.div
            className="privacy__features"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {privacyFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="privacy__feature"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              >
                <span className="privacy__feature-check">✓</span>
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
