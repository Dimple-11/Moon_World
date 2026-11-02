import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, Copy, Check, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { personalInfo } from '../data/portfolioData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [persisted, setPersisted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email format';
    }
    if (!formData.subject.trim()) errs.subject = 'Please specify a subject';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please enter a message of at least 10 characters';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to send note.');
      }

      setSubmitted(true);
      setPersisted(data.storage === 'mongodb');
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmitError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section-wrap contact-section" id="contact">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow-pill">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Get in Touch</span>
          </div>
          <h2 className="section-title">
            Have something <span className="sakura-gradient-text">interesting in mind?</span>
          </h2>
          <p className="section-subtitle">
            Whether you want to collaborate on an AI project, discuss an internship opportunity, or just say hi, my inbox is always open.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="contact-main-grid">
          {/* Left Column: Contact Channels */}
          <div className="contact-info-panel">
            <div className="contact-info-card">
              <h3 className="contact-panel-title">Let's connect</h3>
              <p className="contact-panel-desc">
                I'm always excited to connect with engineers, mentors, and product builders. Feel free to reach out directly via email or socials.
              </p>

              {/* Direct Email Card with One-Click Copy */}
              <div className="contact-direct-box">
                <div className="direct-box-left">
                  <div className="direct-icon-circle">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="direct-label">Direct Email</span>
                    <a href={`mailto:${personalInfo.email}`} className="direct-email-link">
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="copy-email-btn"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? <Check size={16} className="copied-icon" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Location and Education */}
              <div className="contact-meta-list">
                <div className="contact-meta-item">
                  <MapPin size={18} className="contact-meta-icon" />
                  <span>{personalInfo.institution}, {personalInfo.location}</span>
                </div>
                <div className="contact-meta-item">
                  <span className="live-status-dot" />
                  <span>{personalInfo.status}</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="contact-socials-group">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill-btn"
                  title="GitHub Profile"
                >
                  <GithubIcon size={17} />
                  <span>GitHub</span>
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill-btn"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon size={17} />
                  <span>LinkedIn</span>
                </a>
              </div>

              {/* Anime Message Carrier Illustration Accent */}
              <div className="contact-anime-accent-card">
                <div className="anime-letter-cat">
                  <span className="accent-emoji">💌 ฅ^•ﻌ•^ฅ</span>
                </div>
                <div className="anime-letter-text">
                  <span className="letter-lore">"Mochi delivers every note directly to Dimple's private dashboard!"</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="contact-form-panel">
            <div className="contact-form-card">
              {submitted ? (
                <div className="form-success-state">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={42} />
                  </div>
                  <h3 className="success-title">Message Received! 🌸</h3>
                  <p className="success-desc">
                    Thank you, <strong>{formData.name}</strong>.{' '}
                    {persisted ? (
                      <>Your note has been safely stored and I'll get back to you at <strong>{formData.email}</strong> as soon as possible.</>
                    ) : (
                      <>Your note reached the studio, but storage is temporarily in memory, so it will not survive a restart. For anything time-sensitive, please also email <strong>{personalInfo.email}</strong>.</>
                    )}
                  </p>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  {submitError && (
                    <div className="form-error-banner">
                      <AlertCircle size={15} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="form-row-duo">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Your Name <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ada Lovelace"
                        className={`form-input ${errors.name ? 'has-error' : ''}`}
                      />
                      {errors.name && <span className="field-error-msg">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Your Email <span className="required-star">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ada@example.com"
                        className={`form-input ${errors.email ? 'has-error' : ''}`}
                      />
                      {errors.email && <span className="field-error-msg">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Collaboration / Opportunity"
                      className={`form-input ${errors.subject ? 'has-error' : ''}`}
                    />
                    {errors.subject && <span className="field-error-msg">{errors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Message <span className="required-star">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Dimple, I came across your work on..."
                      className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                    />
                    {errors.message && <span className="field-error-msg">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>Sending your note...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
