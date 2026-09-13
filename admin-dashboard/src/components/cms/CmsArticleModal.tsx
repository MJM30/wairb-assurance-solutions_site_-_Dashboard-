import { useState, useEffect } from 'react';
import type { CmsArticle, PageStatus } from '../../lib/cmsStorage';
import { X, Upload, Check, Eye } from 'lucide-react';

interface CmsArticleModalProps {
  article: CmsArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: CmsArticle) => void;
}

export default function CmsArticleModal({ article, isOpen, onClose, onSave }: CmsArticleModalProps) {
  const [formData, setFormData] = useState<CmsArticle | null>(null);

  useEffect(() => {
    if (article) {
      setFormData(JSON.parse(JSON.stringify(article)));
    } else {
      setFormData({
        id: `art_${Date.now()}`,
        title: '',
        slug: '',
        category: 'Institutionnel',
        excerpt: '',
        content: '',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        imageUrl: '/images/img_15.jpg',
        author: 'Équipe WAIRB',
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [article, isOpen]);

  if (!isOpen || !formData) return null;

  function handleSubmit(status: PageStatus) {
    if (!formData) return;
    if (!formData.title.trim()) {
      alert('Veuillez renseigner un titre pour l\'article.');
      return;
    }
    const slug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const updated: CmsArticle = {
      ...formData,
      slug,
      status,
      updatedAt: new Date().toISOString()
    };
    onSave(updated);
    onClose();
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !formData) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData(prev => prev ? ({ ...prev, imageUrl: ev.target?.result as string }) : null);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
        width: '100%', maxWidth: 750, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'between'
        }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {article ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
            </h3>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              Statut actuel : {formData.status === 'published' ? '🟢 Publié' : '🟡 Brouillon'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Titre de l'article *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre accrocheur..."
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                Catégorie
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Institutionnel, Conseils..."
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                Date de publication
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                placeholder="Ex: 15 Mai 2025"
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                Auteur
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                placeholder="Auteur..."
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                }}
              />
            </div>
          </div>

          {/* Cover image preview & upload */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Image de couverture
            </label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 100, height: 65, borderRadius: 8, overflow: 'hidden', background: '#000',
                border: '1px solid var(--border)', flexShrink: 0
              }}>
                <img src={formData.imageUrl} alt="Couverture" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="URL de l'image (Ex: /images/img_15.jpg)"
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 12
                  }}
                />
                <label style={{
                  padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content',
                  color: 'var(--text-primary)'
                }}>
                  <Upload size={12} /> Téléverser un fichier local
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Résumé / Extrait (Aperçu dans la grille)
            </label>
            <textarea
              rows={3}
              value={formData.excerpt}
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Court résumé de l'article..."
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Contenu complet de l'article
            </label>
            <textarea
              rows={7}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Rédigez l'article complet ici..."
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, resize: 'vertical', lineHeight: 1.5
              }}
            />
          </div>

          {/* Footer actions */}
          <div style={{
            marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Annuler
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                Enregistrer brouillon
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('published')}
                style={{
                  padding: '8px 20px', borderRadius: 8, border: 'none',
                  background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <Check size={16} /> Publier l'article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
