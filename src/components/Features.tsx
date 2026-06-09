'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🔒',
    title: '100% Local',
    desc: 'Speech-to-text and text-to-speech run purely on your machine. No cloud dependencies, no API calls, no subscriptions.',
  },
  {
    icon: '⚡',
    title: 'Always-On',
    desc: 'Near-zero latency wake-word detection keeps Lumi ready to respond instantly, running silently in the background.',
  },
  {
    icon: '🎯',
    title: 'Unrestricted Control',
    desc: 'Open apps, manage files, search the web, and change system settings effortlessly — all with natural voice commands.',
  },
  {
    icon: '✨',
    title: 'Ambient UI',
    desc: 'A sleek, floating HUD that stays out of your way. Minimal, beautiful, and only appears when you need it.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="container">
        <motion.div
          className="features__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="features__label">Features</p>
          <h2 className="features__title">
            Engineered for <span className="gradient-text">power users</span>
          </h2>
          <p className="features__subtitle">
            Every component of Lumi is built from the ground up for speed,
            privacy, and seamless desktop integration.
          </p>
        </motion.div>

        <motion.div
          className="features__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="feature-card"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
