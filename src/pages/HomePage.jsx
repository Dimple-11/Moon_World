import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveCharacter from '../components/InteractiveCharacter';
import HomeSnapshot from '../components/HomeSnapshot';
import {
  ArrowUpRight, Sparkles, Send, Award, Compass, Heart,
  ArrowRight, FolderGit2, BookOpen
} from 'lucide-react';
import { personalInfo, projectsData } from '../data/portfolioData';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const letterContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.25 }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 12, stiffness: 200 }
  }
};

export default function HomePage() {
  const characterAreaRef = useRef(null);
  const [phraseIdx, setPhraseIdx] = useState(0);

  const phrases = personalInfo.rotatingPhrases;
  const nameChars = "Dimple".split("");

  // Rotating phrases effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="home-page-view">
      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section className="hero-section" id="hero">
        <div className="hero-container">
          {/* Left Column: Introduction with Framer Motion */}
          <motion.div
            className="hero-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow & Status */}
            <motion.div variants={itemVariants} className="hero-eyebrow-row">
              <div className="hero-eyebrow">
                <Sparkles size={13} className="eyebrow-icon" />
                <span>Information Technology @ IGDTUW '28</span>
              </div>
              <div className="hero-status-pill">
                <span className="status-ping" />
                <span>Available for SDE &amp; AI/ML Roles</span>
              </div>
            </motion.div>

            {/* Rotating Title */}
            <motion.h1 variants={itemVariants} className="hero-title">
              Building intelligent things as an{' '}
              <span className="hero-rotating-word-slot">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIdx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="hero-rotating-word"
                  >
                    {phrases[phraseIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
              .
            </motion.h1>

            {/* Subtitle / Bio with Character-by-character reveal for "Dimple" */}
            <motion.div variants={itemVariants} className="hero-description-wrap">
              <p className="hero-description">
                Hi, I'm{' '}
                <motion.span
                  className="hero-highlight-name-letters"
                  variants={letterContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {nameChars.map((char, index) => (
                    <motion.span key={index} variants={letterVariants} className="name-char">
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
                , an Information Technology undergraduate at <strong>IGDTUW</strong>. I enjoy building AI-powered applications, full-stack products, and creative digital experiences that solve real-world problems.
              </p>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div variants={itemVariants} className="hero-cta-group">
              <Link to="/projects" className="btn btn-primary">
                <span>Explore Projects</span>
                <ArrowUpRight size={17} />
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                <Send size={15} />
                <span>Contact Me</span>
              </Link>
              <Link to="/blog" className="btn btn-ghost-accent">
                <BookOpen size={15} />
                <span>Read Articles</span>
              </Link>
            </motion.div>

            {/* Quick Stats Pills */}
            <motion.div variants={itemVariants} className="hero-quick-stats">
              <Link to="/achievements" className="stat-pill-link">
                <Award size={14} className="stat-icon" />
                <span>Top 10 InnoVortex Finalist</span>
              </Link>
              <Link to="/achievements" className="stat-pill-link">
                <Sparkles size={14} className="stat-icon" />
                <span>MOVES '26 Top 200</span>
              </Link>
              <Link to="/about" className="stat-pill-link">
                <Compass size={14} className="stat-icon" />
                <span>IGDTUW Class of 2028</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Character Stage with Handwritten Anime Caption */}
          <div className="hero-right">
            <div className="character-stage-wrapper">
              <div className="character-stage" ref={characterAreaRef}>
                <div className="character-ambient-glow" />
                <InteractiveCharacter
                  containerRef={characterAreaRef}
                  idleFrame={0}
                  className="hero-character-instance"
                />
              </div>

              {/* Special Anime Handwritten Lore Caption */}
              <div className="character-handwritten-note" aria-label="Character lore note">
                <span className="handwritten-sparkle">✦</span>
                <span className="handwritten-text">"Her headphones hold her emotions."</span>
                <span className="handwritten-heart"><Heart size={13} fill="currentColor" /></span>
                <div className="audio-wave-visualizer">
                  <span /><span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          HOME SNAPSHOT BENTO
          ========================================= */}
      <HomeSnapshot />

      {/* =========================================
          FEATURED PROJECTS PREVIEW STRIP
          ========================================= */}
      <section className="section-wrap home-preview-section">
        <div className="section-container">
          <motion.div
            className="preview-section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="section-eyebrow-pill">
                <FolderGit2 size={13} className="eyebrow-icon" />
                <span>Featured Creations</span>
              </div>
              <h2 className="section-title">
                Selected <span className="sakura-gradient-text">Engineering Projects</span>
              </h2>
            </div>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              <span>View All Projects</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="projects-card-grid">
            {projectsData.slice(0, 3).map((proj, pIdx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: pIdx * 0.12 }}
              >
                <Link
                  to={`/projects/${proj.slug}`}
                  className="project-showcase-card"
                >
                  <div className="project-card-meta-row">
                    <span className="project-cat-tag">{proj.category}</span>
                    <span className="project-metrics-pill">{proj.metrics}</span>
                  </div>
                  <h3 className="project-heading">{proj.title}</h3>
                  <p className="project-subheading">{proj.subtitle}</p>
                  <p className="project-summary-text">{proj.shortDesc}</p>
                  <div className="project-tags-cluster">
                    {proj.tags.slice(0, 4).map((t, tidx) => (
                      <span key={tidx} className="project-mini-tag">{t}</span>
                    ))}
                  </div>
                  <div className="project-card-footer">
                    <span className="project-details-btn">
                      <span>Read Case Study</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
