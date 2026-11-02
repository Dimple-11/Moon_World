import React, { useEffect, useState } from 'react';
import { Database, AlertTriangle } from 'lucide-react';

/**
 * Small, clear indicator that the studio is running on the in-memory
 * fallback store, so nothing the owner saves will survive a restart.
 */
export default function DatabaseStatusBanner() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        if (!cancelled) setStatus(data?.database || null);
      } catch {
        // The API being unreachable is a separate concern; stay quiet here.
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!status || status.connected) return null;

  return (
    <div className="admin-db-banner" role="status">
      <span className="admin-db-banner-icon"><AlertTriangle size={15} /></span>
      <span className="admin-db-banner-text">
        <strong>Running without database:</strong> changes won&apos;t be saved after restart.
      </span>
      <span className="admin-db-banner-meta"><Database size={12} /> in-memory store</span>
    </div>
  );
}
