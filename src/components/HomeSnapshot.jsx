import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles, GraduationCap, Briefcase, FolderGit2, Compass,
  Code2, Wrench, ArrowRight, ArrowUpRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import {
  personalInfo, aboutHighlights, skillsData, projectsData,
  experienceData, futureBuilds
} from '../data/portfolioData';
import { githubUrl, linkedinUrl } from '../data/links';

const education = aboutHighlights.find((item) => item.title === 'Education');
const featuredProjects = projectsData.filter((project) => project.featured).slice(0, 3);
const topSkills = skillsData
  .flatMap((group) => group.skills)
  .filter((skill) => skill.highlight)
  .slice(0, 8);
const toolsGroup = skillsData.find((group) => group.category === 'Tools & DevOps');

const prettyUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '');

function SnapshotCard({
  icon: Icon,
  title,
  body,
  lines,
  chips,
  cta,
  to,
  external = false,
  compact = false
}) {
  const className = `snapshot-card${compact ? ' is-compact' : ''}`;
  const content = (
    <>
      <span className="snapshot-card-top">
        <span className="snapshot-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <span className="snapshot-arrow" aria-hidden="true">
          {external ? <ArrowUpRight size={16} /> : <ArrowRight size={16} />}
        </span>
      </span>

      <h3 className="snapshot-title">{title}</h3>

      {body && <p className="snapshot-body">{body}</p>}

      {lines && lines.length > 0 && (
        <ul className="snapshot-lines">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      {chips && chips.length > 0 && (
        <div className="snapshot-chips">
          {chips.map((chip) => (
            <span key={chip} className="snapshot-chip">{chip}</span>
          ))}
        </div>
      )}

      {cta && <span className="snapshot-cta">{cta}</span>}
    </>
  );

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`${title} (opens in a new tab)`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {content}
    </Link>
  );
}

export default function HomeSnapshot() {
  const reduceMotion = useReducedMotion();

  const cards = [
    {
      icon: Sparkles,
      title: 'About me',
      body: personalInfo.bio,
      cta: 'Read my story',
      to: '/about'
    },
    {
      icon: GraduationCap,
      title: 'Education',
      chips: [
        education?.subtitle,
        'IGDTUW',
        `Class of ${personalInfo.graduationYear}`
      ].filter(Boolean),
      cta: 'See education',
      to: '/about#education'
    },
    {
      icon: Briefcase,
      title: 'Experience',
      lines: experienceData.slice(0, 2).map((item) => `${item.role} · ${item.organization}`),
      cta: 'View journey',
      to: '/experience'
    },
    {
      icon: FolderGit2,
      title: 'Current projects',
      lines: featuredProjects.map((project) => project.title),
      cta: 'Explore projects',
      to: '/projects'
    },
    {
      icon: Compass,
      title: 'Building next',
      chips: futureBuilds.map((idea) => idea.title),
      cta: "See what's next",
      to: '/beyond-code'
    },
    {
      icon: Code2,
      title: 'Skills',
      chips: topSkills.map((skill) => skill.name),
      cta: 'View skills',
      to: '/skills'
    },
    {
      icon: Wrench,
      title: 'Software & tools',
      chips: (toolsGroup?.skills || []).map((skill) => skill.name),
      cta: 'See tools',
      to: '/skills#software'
    },
    {
      icon: LinkedinIcon,
      title: 'LinkedIn',
      body: prettyUrl(linkedinUrl),
      cta: 'Connect',
      to: linkedinUrl,
      external: true,
      compact: true
    },
    {
      icon: GithubIcon,
      title: 'GitHub',
      body: prettyUrl(githubUrl),
      cta: 'See my code',
      to: githubUrl,
      external: true,
      compact: true
    }
  ];

  return (
    <section className="section-wrap home-snapshot-section" id="snapshot" aria-labelledby="snapshot-title">
      <div className="section-container">
        <motion.div
          className="section-header snapshot-header"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
        >
          <div className="section-eyebrow-pill">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Snapshot</span>
          </div>
          <h2 className="section-title" id="snapshot-title">
            A quick tour of <span className="sakura-gradient-text">my universe</span>
          </h2>
          <p className="section-subtitle">
            Nine small doors into the work, the tools, and the person behind them.
          </p>
        </motion.div>

        <div className="snapshot-grid">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              className="snapshot-item"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.24)
              }}
            >
              <SnapshotCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
