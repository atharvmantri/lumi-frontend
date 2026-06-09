'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="footer__brand-dot" />
            Lumi
          </div>

          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Lumi. All rights reserved.
          </p>

          <ul className="footer__links">
            <li>
              <a
                href="https://github.com"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="#docs"
                className="footer__link"
              >
                Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </motion.footer>
  );
}
