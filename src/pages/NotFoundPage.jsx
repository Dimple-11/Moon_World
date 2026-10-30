import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-view not-found-view">
      <div className="not-found-content">
        <div className="not-found-sakura">✿</div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Oops — this page floated away.</h2>
        <p className="not-found-msg">
          The page you're looking for doesn't exist, or the sakura petals carried it off.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            <Sparkles size={16} />
            <span>Explore Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
