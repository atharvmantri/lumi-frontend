'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    icon: '🎙️',
    title: 'Wake Word',
    desc: 'Say "Hey Lumi" to activate',
  },
  {
    num: '02',
    icon: '🔊',
    title: 'Whisper STT',
    desc: 'GPU-accelerated speech recognition',
  },
  {
    num: '03',
    icon: '🧠',
    title: 'Nemotron LLM',
    desc: 'Local language model reasoning',
  },
  {
    num: '04',
    icon: '⚙️',
    title: 'Action Executor',
    desc: 'System-level command execution',
  },
  {
    num: '05',
    icon: '🔈',
    title: 'Piper TTS',
    desc: 'Natural voice synthesis response',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="section how-it-works" id="how-it-works">
      <div className="container">
        <motion.div
          className="how-it-works__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="how-it-works__label">The Loop</p>
          <h2 className="how-it-works__title">
            From voice to <span className="gradient-text">action</span>
          </h2>
          <p className="how-it-works__subtitle">
            A complete pipeline running locally on your GPU — from wake word
            detection to voice response in milliseconds.
          </p>
        </motion.div>

        <motion.div
          className="pipeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Connector line */}
          <div className="pipeline__connector">
            <div className="pipeline__connector-glow" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="pipeline__step"
              variants={stepVariants}
            >
              <div className="pipeline__step-number">{step.num}</div>
              <div className="pipeline__step-icon">{step.icon}</div>
              <div className="pipeline__step-title">{step.title}</div>
              <div className="pipeline__step-desc">{step.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
