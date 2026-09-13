import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCmsPages, getCmsArticles
} from '../../lib/cmsStorage';
import type { CmsPage, PageStatus } from '../../lib/cmsStorage';
import {
  FileText, Home, Wrench, Info, PhoneCall, Newspaper, CheckCircle, Clock, Eye, Edit3, ArrowRight, RefreshCw
} from 'lucide-react';

export default function CmsDashboard() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setPages(getCmsPages());
    setArticlesCount(getCmsArticles().length);
  }

  const publishedCount = pages.filter(p => p.status === 'published').length;
  const draftCount = pages.filter(p => p.status === 'draft').length;

  const pageIcons: Record<string, typeof Home> = {
    accueil: Home,
    'nos-solutions': Wrench,
    apropos: Info,
    contact: PhoneCall,
    actualites: Newspaper,
  };

  function getStatusBadge(status: PageStatus) {
    switch (status) {
      case 'published':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999,
            background: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', fontSize: 11, fontWeight: 700
          }}>
            🟢 Publié
          </span>
        );
      case 'draft':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999,
            background: 'rgba(234, 179, 8, 0.12)', color: '#ca8a04', fontSize: 11, fontWeight: 700
          }}>
            🟡 Brouillon
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999,
            background: 'rgba(148, 163, 184, 0.12)', color: '#64748b', fontSize: 11, fontWeight: 700
          }}>
            ⚪ Non publié
          </span>
        );
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            CMS / Gestion du Contenu
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Gérez l'ensemble des pages, sections, textes, images et actualités du site public WAIRB.
          </p>
        </div>
        <button
          onClick={loadData}
          style={{
            padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* Synthetic Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{
          padding: 20, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'rgba(59, 130, 246, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6'
          }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{pages.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pages du site</div>
          </div>
        </div>

        <div style={{
          padding: 20, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'rgba(34, 197, 94, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a'
          }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{publishedCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pages Publiées</div>
          </div>
        </div>

        <div style={{
          padding: 20, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'rgba(234, 179, 8, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ca8a04'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{draftCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Brouillons en cours</div>
          </div>
        </div>

        <div style={{
          padding: 20, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'rgba(168, 85, 247, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7'
          }}>
            <Newspaper size={24} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{articlesCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Articles d'Actualités</div>
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Pages du Site Vitrine
          </h2>
          <button
            onClick={() => navigate('/cms/actualites')}
            style={{
              padding: '6px 12px', borderRadius: 8, background: 'var(--accent)', color: '#fff',
              border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <Newspaper size={14} /> Gérer le module Actualités
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {pages.map(page => {
            const Icon = pageIcons[page.slug] || FileText;
            const dateStr = new Date(page.lastModified).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            return (
              <div
                key={page.slug}
                style={{
                  padding: 20, background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16,
                  transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, background: 'var(--bg-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
                        border: '1px solid var(--border)'
                      }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {page.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Route : /{page.slug === 'accueil' ? '' : page.slug}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(page.status)}
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 16, marginTop: 8 }}>
                    <span>{page.sectionsCount} Sections configurées</span>
                    <span>Modifié : {dateStr}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)'
                }}>
                  <button
                    onClick={() => navigate(`/cms/pages/${page.slug}`)}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 8, background: 'var(--accent)', color: '#fff',
                      border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <Edit3 size={14} /> Modifier le contenu
                  </button>
                  <a
                    href={`http://localhost:3000/${page.slug === 'accueil' ? '' : page.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '8px 12px', borderRadius: 8, background: 'var(--bg-primary)', color: 'var(--text-primary)',
                      border: '1px solid var(--border)', fontSize: 12, fontWeight: 600, textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <Eye size={14} /> Voir
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
