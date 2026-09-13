import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCmsPages, getCmsSections, saveCmsSection, deleteCmsSection,
  toggleCmsSectionVisibility, moveCmsSection, duplicateCmsSection,
  publishPageChanges, updatePageStatus
} from '../../lib/cmsStorage';
import type { CmsSection, CmsPage, PageStatus } from '../../lib/cmsStorage';
import CmsSectionModal from '../../components/cms/CmsSectionModal';
import CmsAddSectionModal from '../../components/cms/CmsAddSectionModal';
import CmsPreviewModal from '../../components/cms/CmsPreviewModal';
import {
  Home, Wrench, Info, PhoneCall, Newspaper, Plus, Eye, EyeOff,
  MoveUp, MoveDown, Edit3, Copy, Trash2, Check, ArrowLeft, Send
} from 'lucide-react';

export default function CmsPageEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const currentSlug = slug || 'accueil';

  const [pages, setPages] = useState<CmsPage[]>([]);
  const [currentPage, setCurrentPage] = useState<CmsPage | null>(null);
  const [sections, setSections] = useState<CmsSection[]>([]);
  
  const [editingSection, setEditingSection] = useState<CmsSection | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadPageData(currentSlug);
  }, [currentSlug]);

  function loadPageData(pageSlug: string) {
    const allPages = getCmsPages();
    setPages(allPages);
    const p = allPages.find(item => item.slug === pageSlug);
    if (p) setCurrentPage(p);
    setSections(getCmsSections(pageSlug));
  }

  function showToast(message: string) {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  }

  function handleSaveSection(updatedSec: CmsSection) {
    saveCmsSection(updatedSec);
    loadPageData(currentSlug);
    showToast('✅ Les modifications de la section ont été enregistrées.');
  }

  function handleAddSection(newSec: CmsSection) {
    saveCmsSection(newSec);
    loadPageData(currentSlug);
    showToast('✅ Nouvelle section ajoutée avec succès.');
  }

  function handleDeleteSection(id: string, name: string) {
    if (window.confirm(`Voulez-vous vraiment supprimer la section "${name}" ?`)) {
      deleteCmsSection(id);
      loadPageData(currentSlug);
      showToast('🗑️ Section supprimée.');
    }
  }

  function handleToggleVisibility(id: string) {
    toggleCmsSectionVisibility(id);
    loadPageData(currentSlug);
  }

  function handleMove(id: string, direction: 'up' | 'down') {
    moveCmsSection(id, direction);
    loadPageData(currentSlug);
  }

  function handleDuplicate(id: string) {
    const copied = duplicateCmsSection(id);
    if (copied) {
      loadPageData(currentSlug);
      showToast('📋 Section dupliquée avec succès.');
    }
  }

  function handleSaveDraft() {
    updatePageStatus(currentSlug, 'draft');
    loadPageData(currentSlug);
    showToast('✅ Les modifications ont été enregistrées comme brouillon.');
  }

  function handlePublish() {
    publishPageChanges(currentSlug);
    loadPageData(currentSlug);
    showToast('🎉 La page a été publiée avec succès !');
  }

  const pageTabs = [
    { slug: 'accueil', label: 'Accueil', icon: Home },
    { slug: 'nos-solutions', label: 'Nos Solutions', icon: Wrench },
    { slug: 'apropos', label: 'À Propos', icon: Info },
    { slug: 'contact', label: 'Contact', icon: PhoneCall },
    { slug: 'actualites', label: 'Actualités', icon: Newspaper },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200, margin: '0 auto' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 1200,
          background: '#064e3b', color: '#ecfdf5', padding: '12px 20px', borderRadius: 10,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.3s'
        }}>
          {notification}
        </div>
      )}

      {/* Top Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/cms')}
            style={{
              padding: 8, borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Éditeur de Page : {currentPage?.title || currentSlug}
              </h1>
              {currentPage?.status === 'published' ? (
                <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: 'rgba(34, 197, 94, 0.15)', color: '#16a34a' }}>
                  🟢 Publié
                </span>
              ) : (
                <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04' }}>
                  🟡 Brouillon
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {sections.length} Sections configurées sur la route /{currentSlug === 'accueil' ? '' : currentSlug}
            </div>
          </div>
        </div>

        {/* Global Page Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            style={{
              padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <Eye size={14} /> Prévisualiser
          </button>

          <button
            onClick={handleSaveDraft}
            style={{
              padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <Check size={14} /> Enregistrer brouillon
          </button>

          <button
            onClick={handlePublish}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <Send size={14} /> Publier la page
          </button>
        </div>
      </div>

      {/* Page Navigation Tabs */}
      <div style={{
        display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 6, borderRadius: 12,
        border: '1px solid var(--border)', overflowX: 'auto'
      }}>
        {pageTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tab.slug === currentSlug;
          return (
            <button
              key={tab.slug}
              onClick={() => navigate(`/cms/pages/${tab.slug}`)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Section Management List Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Sections de la page ({sections.length})
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff',
            border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <Plus size={14} /> Ajouter une section
        </button>
      </div>

      {/* Sections Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.length === 0 ? (
          <div style={{
            padding: 40, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 12,
            border: '1px solid var(--border)', color: 'var(--text-muted)'
          }}>
            Aucune section définie pour cette page. Cliquez sur "Ajouter une section" pour commencer.
          </div>
        ) : (
          sections.map((sec, idx) => (
            <div
              key={sec.id}
              style={{
                padding: 16, background: 'var(--bg-card)', borderRadius: 12,
                border: `1px solid ${sec.visible ? 'var(--border)' : 'rgba(239, 68, 68, 0.3)'}`,
                opacity: sec.visible ? 1 : 0.65, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                {/* Index badge */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: 'var(--bg-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'var(--accent)', border: '1px solid var(--border)'
                }}>
                  {idx + 1}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {sec.name}
                    </span>
                    <span style={{
                      padding: '2px 6px', borderRadius: 4, background: 'var(--bg-primary)',
                      color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase'
                    }}>
                      {sec.type}
                    </span>
                    {!sec.visible && (
                      <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 600 }}>[Masqué sur le site]</span>
                    )}
                  </div>

                  <div style={{
                    fontSize: 12, color: 'var(--text-muted)', marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {sec.title || sec.subtitle || sec.description || 'Sans titre'}
                  </div>
                </div>
              </div>

              {/* Actions controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Move controls */}
                <button
                  type="button"
                  onClick={() => handleMove(sec.id, 'up')}
                  disabled={idx === 0}
                  title="Monter"
                  style={{
                    padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)',
                    cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1
                  }}
                >
                  <MoveUp size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleMove(sec.id, 'down')}
                  disabled={idx === sections.length - 1}
                  title="Descendre"
                  style={{
                    padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)',
                    cursor: idx === sections.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === sections.length - 1 ? 0.3 : 1
                  }}
                >
                  <MoveDown size={14} />
                </button>

                {/* Visibility toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(sec.id)}
                  title={sec.visible ? 'Masquer la section' : 'Afficher la section'}
                  style={{
                    padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: sec.visible ? 'var(--text-primary)' : '#ef4444',
                    cursor: 'pointer'
                  }}
                >
                  {sec.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => handleDuplicate(sec.id)}
                  title="Dupliquer"
                  style={{
                    padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer'
                  }}
                >
                  <Copy size={14} />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => { setEditingSection(sec); setIsEditModalOpen(true); }}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: 'none',
                    background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  <Edit3 size={14} /> Modifier
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteSection(sec.id, sec.name)}
                  title="Supprimer"
                  style={{
                    padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                    background: '#fee2e2', color: '#dc2626', cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <CmsSectionModal
        section={editingSection}
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingSection(null); }}
        onSave={handleSaveSection}
      />

      <CmsAddSectionModal
        pageSlug={currentSlug}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSection}
      />

      <CmsPreviewModal
        pageTitle={currentPage?.title || currentSlug}
        pageSlug={currentSlug}
        sections={sections}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </div>
  );
}
