import React from 'react';
import ReactDOM from 'react-dom/client';

// Styles: order matters — keep the cascade identical to the original index.css
import './styles/theme.css';
import './styles/features/layout.css';
import './styles/features/navbar.css';
import './styles/features/sections.css';
import './styles/features/utilities.css';
import './styles/features/pages.css';
import './styles/features/editorial.css';
import './styles/features/mochi.css';
import './styles/features/music.css';
import './styles/features/blog-gallery.css';
import './styles/features/admin.css';
import './styles/hero.css';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
