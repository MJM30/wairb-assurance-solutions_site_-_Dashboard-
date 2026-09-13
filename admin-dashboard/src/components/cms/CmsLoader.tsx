import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { initCmsStore } from '../../lib/cmsStorage';

export default function CmsLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initCmsStore().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'rgba(255,255,255,0.5)' }}>
        <p>Chargement du CMS...</p>
      </div>
    );
  }

  return <Outlet />;
}
