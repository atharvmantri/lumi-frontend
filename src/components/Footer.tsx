'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <Image
              src="/logo-icon.png"
              alt="Lumi"
              width={22}
              height={22}
              className="footer__brand-img"
            />
            Lumi
          </div>

          <p className="footer__copy">
            &copy; {CURRENT_YEAR} Lumi. All rights reserved.
          </p>
          
          <p className="footer__copy" style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
            AI Declaration: Claude and Gemini were used to assist in the coding and planning of this project.
          </p>

          <ul className="footer__links">
            <li>
              <a
                href="https://github.com/atharvmantri/lumi-assist"
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
