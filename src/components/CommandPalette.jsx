import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, User, Code2, FolderGit2, Briefcase, Trophy, Award, Palette, Mail, Sun, Moon, Music, Sparkles, X, ArrowRight, BookOpen, Image } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function CommandPalette({ isOpen, onClose, theme, onToggleTheme, onOpenMusic }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const commandItems = [
    { label: 'Go to Home', desc: 'Hero & Character Universe', icon: Home, action: () => navigate('/') },
    { label: 'Go to About Me', desc: 'Behind the Pixels & Background', icon: User, action: () => navigate('/about') },
    { label: 'Go to Technical Skills', desc: 'Programming, ML & Frameworks', icon: Code2, action: () => navigate('/skills') },
    { label: 'Go to Projects', desc: 'AI Systems & Full-Stack Creations', icon: FolderGit2, action: () => navigate('/projects') },
    { label: 'Go to Blog Studio', desc: 'Articles, Tutorials & Reflections', icon: BookOpen, action: () => navigate('/blog') },
    { label: 'Go to Photo Scrapbook', desc: 'Campus & Hackathon Visual Memories', icon: Image, action: () => navigate('/gallery') },
    { label: 'Go to Experience', desc: 'ProdigalAI, Aevona & TechNeeds', icon: Briefcase, action: () => navigate('/experience') },
    { label: 'Go to Achievements', desc: 'InnoVortex, MOVES 2026 & CP', icon: Trophy, action: () => navigate('/achievements') },
    { label: 'Go to Certifications', desc: 'Hugging Face & ML Specializations', icon: Award, action: () => navigate('/certifications') },
    { label: 'Go to Beyond Code', desc: 'Media, Writing & Leadership', icon: Palette, action: () => navigate('/beyond-code') },
    { label: 'Go to Contact', desc: 'Direct Note & Inquiries', icon: Mail, action: () => navigate('/contact') },
    {
      label: `Switch Theme to ${theme === 'dark' ? 'Sakura Dream' : 'Midnight Sakura'}`,
      desc: 'Toggle visual theme',
      icon: theme === 'dark' ? Sun : Moon,
      action: onToggleTheme
    },
    {
      label: 'Open Music Player',
      desc: 'Listen to soundtrack or upload audio',
      icon: Music,
      action: onOpenMusic
    },
    {
      label: 'Send Email Directly',
      desc: personalInfo.email,
      icon: Mail,
      action: () => window.location.href = `mailto:${personalInfo.email}`
    }
  ];

  const filtered = commandItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette-modal" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="palette-search-bar">
          <Search size={18} className="palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
            placeholder="Type a command, page, or search query... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="palette-close-btn" onClick={onClose} aria-label="Close palette">
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="palette-results-list">
          {filtered.length === 0 ? (
            <div className="palette-empty-state">
              <span>No matching commands found for "{query}"</span>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  className={`palette-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="palette-item-left">
                    <div className="palette-item-icon-box">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="palette-item-label">{item.label}</div>
                      <div className="palette-item-desc">{item.desc}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="palette-item-arrow" />
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer Help */}
        <div className="palette-footer-tips">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to select</span>
          <span><kbd>esc</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
}
