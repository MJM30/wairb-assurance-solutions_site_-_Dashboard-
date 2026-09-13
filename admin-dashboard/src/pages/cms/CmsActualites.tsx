import { useState, useEffect } from 'react';
import {
  getCmsArticles, saveCmsArticle, deleteCmsArticle, toggleArticlePublish
} from '../../lib/cmsStorage';
import type { CmsArticle } from '../../lib/cmsStorage';
import CmsArticleModal from '../../components/cms/CmsArticleModal';
import {
  Newspaper, Plus, Edit3, Trash2, Eye, Calendar, User, Tag, Check, RefreshCw
} from 'lucide-react';

export default function CmsActualites() {
  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<CmsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  function loadArticles() {
    setArticles(getCmsArticles());
  }

  function showToast(message: string) {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  }

  function handleSave(article: CmsArticle) {
    saveCmsArticle(article);
    loadArticles();
    showToast('✅ Article d\'actualité enregistré avec succès.');
  }

  function handleDelete(id: string, title: string) {
    if (window.confirm(`Voulez-vous vraiment supprimer l'article "${title}" ?`)) {
      deleteCmsArticle(id);
      loadArticles();
      showToast('🗑️ Article supprimé.');
    }
  }

  function handleTogglePublish(id: string) {
    toggleArticlePublish(id);
    loadArticles();
  }

  const categories = Array.from(new Set(articles.map(a => a.category)));

  const filteredArticles = filterCategory === 'all'
    ? articles
    : articles.filter(a => a.category === filterCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200, margin: '0 auto' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 1200,
          background: '#064e3b', color: '#ecfdf5', padding: '12px 20px', borderRadius: 10,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          {notification}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Gestion des Actualités & Articles
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Ajoutez, modifiez et publiez des articles récents sur le site public WAIRB.
          </p>
        </div>
        <button
          onClick={() => { setEditingArticle(null); setIsModalOpen(true); }}
          style={{
            padding: '10px 18px', borderRadius: 8, background: 'var(--accent)', color: '#fff',
            border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <Plus size={16} /> Nouvelle actualité
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Filtrer par catégorie :</span>
        <button
          onClick={() => setFilterCategory('all')}
          style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
            background: filterCategory === 'all' ? 'var(--accent)' : 'var(--bg-card)',
            color: filterCategory === 'all' ? '#fff' : 'var(--text-primary)'
          }}
        >
          Toutes ({articles.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: filterCategory === cat ? 'var(--accent)' : 'var(--bg-card)',
              color: filterCategory === cat ? '#fff' : 'var(--text-primary)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Table / Cards */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Couverture</th>
              <th style={{ padding: '12px 16px' }}>Titre & Extrait</th>
              <th style={{ padding: '12px 16px' }}>Catégorie</th>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Statut</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                  Aucun article trouvé.
                </td>
              </tr>
            ) : (
              filteredArticles.map(art => (
                <tr key={art.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', width: 90 }}>
                    <div style={{
                      width: 70, height: 48, borderRadius: 8, overflow: 'hidden', background: '#000',
                      border: '1px solid var(--border)'
                    }}>
                      <img src={art.imageUrl} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {art.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {art.excerpt}
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: 6, background: 'var(--bg-primary)',
                      color: 'var(--accent)', fontSize: 11, fontWeight: 700
                    }}>
                      {art.category}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontSize: 12, color: 'var(--text-muted)' }}>
                    {art.date}
                  </td>

                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleTogglePublish(art.id)}
                      style={{
                        padding: '4px 10px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                        background: art.status === 'published' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: art.status === 'published' ? '#16a34a' : '#ca8a04',
                        fontSize: 11, fontWeight: 700
                      }}
                    >
                      {art.status === 'published' ? '🟢 Publié' : '🟡 Brouillon'}
                    </button>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => { setEditingArticle(art); setIsModalOpen(true); }}
                        style={{
                          padding: '6px 10px', borderRadius: 6, border: 'none',
                          background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 600,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                        }}
                      >
                        <Edit3 size={14} /> Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(art.id, art.title)}
                        style={{
                          padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                          background: '#fee2e2', color: '#dc2626', cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CmsArticleModal
        article={editingArticle}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingArticle(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
