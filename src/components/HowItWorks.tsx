'use client';

import { motion } from 'framer-motion';
import { IconMic, IconWaveform, IconCpu, IconTerminal, IconSpeaker } from './Icons';

const steps = [
  {
    num: '01',
    icon: <IconMic size={24} />,
    title: 'Wake Word',
    desc: 'Say "Hey Lumi" to activate',
  },
  {
    num: '02',
    icon: <IconWaveform size={24} />,
    title: 'Whisper STT',
    desc: 'GPU-accelerated speech recognition',
  },
  {
    num: '03',
    icon: <IconCpu size={24} />,
    title: 'Nemotron LLM',
    desc: 'Local language model reasoning',
  },
  {
    num: '04',
    icon: <IconTerminal size={24} />,
    title: 'Action Executor',
    desc: 'System-level command execution',
  },
  {
    num: '05',
    icon: <IconSpeaker size={24} />,
    title: 'Piper TTS',
    desc: 'Natural voice synthesis response',
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

const stepVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="section how-it-works" id="how-it-works">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label" style={{ color: 'var(--color-purple)' }}>The Loop</span>
          <h2 className="section-title">
            From voice to <span className="gradient-text">action</span>
          </h2>
          <p className="section-subtitle">
            A complete pipeline running locally on your GPU — from wake word
            detection to voice response in milliseconds.
          </p>
        </motion.div>

        <motion.div
          className="pipeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
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
