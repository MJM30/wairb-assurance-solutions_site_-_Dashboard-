import type { CmsSection } from '../../lib/cmsStorage';
import { X, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';

interface CmsPreviewModalProps {
  pageTitle: string;
  pageSlug: string;
  sections: CmsSection[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CmsPreviewModal({ pageTitle, pageSlug, sections, isOpen, onClose }: CmsPreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Top Controls Bar */}
      <div style={{
        height: 60, padding: '0 24px', background: '#111827', borderBottom: '1px solid #374151',
        display: 'flex', alignItems: 'center', justifyContent: 'between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
            Prévisualisation : {pageTitle}
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
            background: '#059669', color: '#fff'
          }}>
            Brouillon en direct
          </span>
        </div>

        {/* Device toggle */}
        <div style={{ display: 'flex', gap: 4, background: '#1f2937', padding: 4, borderRadius: 8 }}>
          <button
            onClick={() => setDevice('desktop')}
            style={{
              padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: device === 'desktop' ? '#374151' : 'transparent', color: '#fff',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12
            }}
          >
            <Monitor size={14} /> Desktop
          </button>
          <button
            onClick={() => setDevice('mobile')}
            style={{
              padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: device === 'mobile' ? '#374151' : 'transparent', color: '#fff',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12
            }}
          >
            <Smartphone size={14} /> Mobile
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href={`http://localhost:3000/${pageSlug === 'accueil' ? '' : pageSlug}`}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12, color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            Ouvrir le site réel <ExternalLink size={12} />
          </a>
          <button
            onClick={onClose}
            style={{
              padding: '6px 12px', borderRadius: 6, border: '1px solid #4b5563',
              background: '#1f2937', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600
            }}
          >
            <X size={16} /> Fermer
          </button>
        </div>
      </div>

      {/* Preview Viewport Container */}
      <div style={{
        flex: 1, overflow: 'auto', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        background: '#030712'
      }}>
        <div style={{
          width: device === 'desktop' ? '100%' : '390px',
          maxWidth: device === 'desktop' ? '1280px' : '390px',
          minHeight: '100%', background: '#ffffff', borderRadius: device === 'desktop' ? 12 : 24,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden',
          transition: 'all 0.3s ease-in-out', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Mock Navbar */}
          <header style={{
            height: 64, padding: '0 24px', background: '#082914', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'between', borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#22c55e', letterSpacing: '-0.02em' }}>
              WAIRB DRC SAS
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
              <span>Accueil</span>
              <span>Nos Solutions</span>
              <span>À Propos</span>
              <span>Contact</span>
              <span>Actualités</span>
            </div>
          </header>

          {/* Render Sections Mock */}
          {visibleSections.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
              Toutes les sections de cette page sont actuellement masquées.
            </div>
          ) : (
            visibleSections.map(sec => (
              <section key={sec.id} style={{
                padding: '48px 24px', borderBottom: '1px solid #f1f5f9',
                background: sec.type === 'hero' ? '#082914' : sec.type === 'process' ? '#f8fafc' : '#ffffff',
                color: sec.type === 'hero' ? '#ffffff' : '#0f172a'
              }}>
                <div style={{ maxWidth: 1024, margin: '0 auto' }}>
                  {sec.badge && (
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                      background: sec.type === 'hero' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e', textTransform: 'uppercase', marginBottom: 12
                    }}>
                      {sec.badge}
                    </span>
                  )}

                  {sec.title && (
                    <h2 style={{
                      fontSize: sec.type === 'hero' ? 32 : 24, fontWeight: 800, margin: '0 0 12px 0',
                      lineHeight: 1.2
                    }}>
                      {sec.title}
                    </h2>
                  )}

                  {sec.subtitle && (
                    <div style={{ fontSize: 16, fontWeight: 600, color: sec.type === 'hero' ? '#cbd5e1' : '#475569', marginBottom: 12 }}>
                      {sec.subtitle}
                    </div>
                  )}

                  {sec.description && (
                    <p style={{
                      fontSize: 14, lineHeight: 1.6, color: sec.type === 'hero' ? '#94a3b8' : '#64748b',
                      marginBottom: 20, maxWidth: 640
                    }}>
                      {sec.description}
                    </p>
                  )}

                  {/* Buttons preview */}
                  {(sec.primaryBtnText || sec.secondaryBtnText) && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                      {sec.primaryBtnText && (
                        <span style={{
                          padding: '10px 20px', borderRadius: 8, background: '#22c55e', color: '#fff',
                          fontSize: 13, fontWeight: 700, display: 'inline-block'
                        }}>
                          {sec.primaryBtnText}
                        </span>
                      )}
                      {sec.secondaryBtnText && (
                        <span style={{
                          padding: '10px 20px', borderRadius: 8, border: '1px solid #cbd5e1',
                          color: sec.type === 'hero' ? '#fff' : '#0f172a', fontSize: 13, fontWeight: 600, display: 'inline-block'
                        }}>
                          {sec.secondaryBtnText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Images Grid */}
                  {sec.images && sec.images.length > 0 && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: `repeat(${Math.min(sec.images.length, 3)}, 1fr)`,
                      gap: 16, marginTop: 24
                    }}>
                      {sec.images.map(img => (
                        <div key={img.id} style={{ borderRadius: 12, overflow: 'hidden', height: 160, background: '#e2e8f0' }}>
                          <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Items List Preview */}
                  {sec.items && sec.items.length > 0 && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: device === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: 16, marginTop: 24
                    }}>
                      {sec.items.map(item => (
                        <div key={item.id} style={{
                          padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc'
                        }}>
                          {item.title && <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{item.title}</div>}
                          {item.description && <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{item.description}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))
          )}

          {/* Footer Mock */}
          <footer style={{ padding: '32px 24px', background: '#082914', color: '#94a3b8', fontSize: 12, textAlign: 'center' }}>
            © {new Date().getFullYear()} WAIRB DRC SAS. Tous droits réservés.
          </footer>
        </div>
      </div>
    </div>
  );
}
