'use client';

import { motion } from 'framer-motion';
import { IconLock, IconZap, IconTarget, IconLayers } from './Icons';

const features = [
  {
    icon: <IconLock size={20} />,
    title: '100% Local',
    desc: 'Speech-to-text and text-to-speech run purely on your machine. No cloud dependencies, no API calls, no subscriptions.',
  },
  {
    icon: <IconZap size={20} />,
    title: 'Always-On',
    desc: 'Near-zero latency wake-word detection keeps Lumi ready to respond instantly, running silently in the background.',
  },
  {
    icon: <IconTarget size={20} />,
    title: 'Unrestricted Control',
    desc: 'Open apps, manage files, search the web, and change system settings effortlessly with natural voice commands.',
  },
  {
    icon: <IconLayers size={20} />,
    title: 'Ambient UI',
    desc: 'A sleek, floating HUD that stays out of your way. Minimal, beautiful, and only appears when you need it.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Features</span>
          <h2 className="section-title">
            Engineered for <span className="gradient-text">power users</span>
          </h2>
          <p className="section-subtitle">
            Every component is built from the ground up for speed,
            privacy, and seamless desktop integration.
          </p>
        </motion.div>

        <motion.div
          className="features__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="feature-card"
              variants={cardVariants}
            >
              <div className="feature-card__icon-wrap">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
