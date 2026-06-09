'use client';

import { motion } from 'framer-motion';
import { IconShield, IconCheck } from './Icons';

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
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="privacy__icon"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <IconShield size={40} />
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
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {privacyFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="privacy__feature"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
              >
                <span className="privacy__feature-check">
                  <IconCheck size={10} />
                </span>
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
