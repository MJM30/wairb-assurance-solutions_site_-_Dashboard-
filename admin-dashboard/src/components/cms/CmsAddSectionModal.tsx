import { useState } from 'react';
import type { CmsSection, SectionType } from '../../lib/cmsStorage';
import { X, Plus } from 'lucide-react';

interface CmsAddSectionModalProps {
  pageSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newSection: CmsSection) => void;
}

const TEMPLATES: { type: SectionType; name: string; desc: string; icon: string }[] = [
  { type: 'hero', name: 'Section Hero / Bannière', desc: 'Grande bannière d\'en-tête avec titre, description, boutons et carrousel d\'images.', icon: '🖼️' },
  { type: 'features', name: 'Grille de Fonctionnalités / Services', desc: 'Présentation de fonctionnalités ou services sous forme de grille de cartes.', icon: '⚡' },
  { type: 'about', name: 'Présentation & Texte d\'À Propos', desc: 'Bloc de présentation avec textes, badges et photo d\'illustration.', icon: 'ℹ️' },
  { type: 'stats', name: 'Chiffres Clés & Statistiques', desc: 'Compteurs dynamiques et statistiques de performance.', icon: '📊' },
  { type: 'process', name: 'Processus en Étape', desc: 'Guide étape par étape (01, 02, 03...) expliquant votre processus.', icon: '🔄' },
  { type: 'faq', name: 'Foire Aux Questions (FAQ)', desc: 'Liste de questions / réponses accordéon.', icon: '❓' },
  { type: 'contact', name: 'Formulaire & Coordonnées', desc: 'Bloc de contact avec coordonnées et formulaire de demande.', icon: '📞' },
  { type: 'partners', name: 'Carrousel Partenaires / Logos', desc: 'Bandeau défilant de logos partenaires.', icon: '🤝' },
  { type: 'timeline', name: 'Chronologie / Histoire', desc: 'Ligne du temps historique retraçant les dates clés.', icon: '📅' },
  { type: 'team', name: 'Galerie d\'Équipe', desc: 'Présentation de l\'équipe dirigeante et des collaborateurs.', icon: '👥' },
  { type: 'banner', name: 'Appel à l\'action (CTA Banner)', desc: 'Bannière d\'incitation avec bouton de prise de contact.', icon: '📣' },
];

export default function CmsAddSectionModal({ pageSlug, isOpen, onClose, onAdd }: CmsAddSectionModalProps) {
  const [selectedType, setSelectedType] = useState<SectionType>('features');
  const [sectionName, setSectionName] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const template = TEMPLATES.find(t => t.type === selectedType);
    const newSec: CmsSection = {
      id: `sec_${Date.now()}`,
      pageSlug,
      name: sectionName.trim() || template?.name || 'Nouvelle Section',
      type: selectedType,
      order: Date.now(),
      visible: true,
      title: sectionTitle.trim() || 'Titre de la nouvelle section',
      description: 'Description de la section...',
      updatedAt: new Date().toISOString()
    };
    onAdd(newSec);
    onClose();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
        width: '100%', maxWidth: 650, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'between'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Ajouter une nouvelle section
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Nom de la section (Pour le CMS)
            </label>
            <input
              type="text"
              required
              value={sectionName}
              onChange={e => setSectionName(e.target.value)}
              placeholder="Ex: Section Témoignages ou Nouveautés"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Titre visible sur le site
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={e => setSectionTitle(e.target.value)}
              placeholder="Ex: Ce que disent nos clients"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
              Sélectionnez le type de section :
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {TEMPLATES.map(tmpl => (
                <div
                  key={tmpl.type}
                  onClick={() => setSelectedType(tmpl.type)}
                  style={{
                    padding: 12, borderRadius: 10, border: `2px solid ${selectedType === tmpl.type ? 'var(--accent)' : 'var(--border)'}`,
                    background: selectedType === tmpl.type ? 'var(--bg-primary)' : 'var(--bg-card)',
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: 10, alignItems: 'flex-start'
                  }}
                >
                  <span style={{ fontSize: 20 }}>{tmpl.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{tmpl.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{tmpl.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'flex-end', gap: 12
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
            <button
              type="submit"
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none',
                background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Plus size={16} /> Ajouter cette section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
