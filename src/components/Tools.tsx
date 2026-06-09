'use client';

import { motion } from 'framer-motion';
import {
  IconMonitor,
  IconFolder,
  IconGlobe,
  IconSettings,
  IconCode,
  IconCalendar,
} from './Icons';

const categories = [
  {
    icon: <IconMonitor size={18} />,
    title: 'System Control',
    desc: 'Full control over your Windows desktop, apps, and processes.',
    tools: ['Open Apps', 'Window Focus', 'Volume', 'Display', 'Power', 'Shortcuts', 'Bluetooth', 'USB'],
  },
  {
    icon: <IconFolder size={18} />,
    title: 'File Management',
    desc: 'Read, write, search, organize, and transform files effortlessly.',
    tools: ['Read / Write', 'Search', 'Organize', 'Hash', 'Metadata', 'Archive', 'Zip'],
  },
  {
    icon: <IconGlobe size={18} />,
    title: 'Web & Network',
    desc: 'Search the web, open URLs, scrape pages, and monitor network status.',
    tools: ['Web Search', 'Browser', 'Scraper', 'DNS', 'Network', 'URL Tools', 'API Calls'],
  },
  {
    icon: <IconCode size={18} />,
    title: 'Developer Tools',
    desc: 'Execute Python, analyze code, run shell commands, and manage Git.',
    tools: ['Python Exec', 'Shell', 'Git', 'GitHub', 'Code Analysis', 'Regex', 'Diff'],
  },
  {
    icon: <IconCalendar size={18} />,
    title: 'Productivity',
    desc: 'Notes, tasks, calendar, timers, reminders, and time tracking.',
    tools: ['Notes', 'Tasks', 'Calendar', 'Timer', 'Scheduler', 'Email', 'Briefing'],
  },
  {
    icon: <IconSettings size={18} />,
    title: 'Media & Utilities',
    desc: 'Image editing, screenshots, OCR, QR codes, audio, and more.',
    tools: ['Screenshot', 'OCR', 'Image Edit', 'Media Control', 'QR Code', 'Calculator', 'Password'],
  },
];

const stats = [
  { number: '90+', label: 'Built-in tools' },
  { number: '6', label: 'Integration categories' },
  { number: '0', label: 'Cloud dependencies' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
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

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function Tools() {
  return (
    <section className="section tools-section" id="tools">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Tools & Integrations</span>
          <h2 className="section-title">
            90+ tools. <span className="gradient-text">And growing</span>
          </h2>
          <p className="section-subtitle">
            From system commands to developer workflows, Lumi can
            control almost everything on your machine.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="tools__stats"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} className="tools__stat" variants={statVariants}>
              <div className="tools__stat-number gradient-text">{stat.number}</div>
              <div className="tools__stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Category Cards */}
        <motion.div
          className="tools__categories"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              className="tools__category"
              variants={cardVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="tools__category-icon">{cat.icon}</div>
              <h3 className="tools__category-title">{cat.title}</h3>
              <p className="tools__category-desc">{cat.desc}</p>
              <div className="tools__category-list">
                {cat.tools.map((tool, j) => (
                  <span key={j} className="tools__tag">{tool}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
