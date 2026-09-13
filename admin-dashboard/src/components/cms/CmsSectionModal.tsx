import { useState, useEffect } from 'react';
import type { CmsSection, CmsImage, CmsSectionItem } from '../../lib/cmsStorage';
import { X, Plus, Trash2, Image as ImageIcon, Check, Upload, MoveUp, MoveDown } from 'lucide-react';

interface CmsSectionModalProps {
  section: CmsSection | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSection: CmsSection) => void;
}

export default function CmsSectionModal({ section, isOpen, onClose, onSave }: CmsSectionModalProps) {
  const [formData, setFormData] = useState<CmsSection | null>(null);
  const [activeTab, setActiveTab] = useState<'texts' | 'images' | 'items'>('texts');
  const [newImageInput, setNewImageInput] = useState('');
  const [newImageName, setNewImageName] = useState('');

  useEffect(() => {
    if (section) {
      setFormData(JSON.parse(JSON.stringify(section)));
    }
  }, [section]);

  if (!isOpen || !formData) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newImg: CmsImage = {
        id: `img_${Date.now()}`,
        url: base64,
        name: file.name,
        alt: file.name.split('.')[0]
      };
      setFormData(prev => prev ? ({
        ...prev,
        images: [...(prev.images || []), newImg]
      }) : null);
    };
    reader.readAsDataURL(file);
  }

  function handleAddImageUrl() {
    if (!newImageInput.trim()) return;
    const newImg: CmsImage = {
      id: `img_${Date.now()}`,
      url: newImageInput.trim(),
      name: newImageName.trim() || 'Image sans nom',
      alt: newImageName.trim() || 'Image'
    };
    setFormData(prev => prev ? ({
      ...prev,
      images: [...(prev.images || []), newImg]
    }) : null);
    setNewImageInput('');
    setNewImageName('');
  }

  function handleRemoveImage(imgId: string) {
    setFormData(prev => prev ? ({
      ...prev,
      images: (prev.images || []).filter(img => img.id !== imgId)
    }) : null);
  }

  function handleMoveImage(index: number, direction: 'up' | 'down') {
    if (!formData?.images) return;
    const images = [...formData.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const temp = images[index];
    images[index] = images[targetIndex];
    images[targetIndex] = temp;
    setFormData({ ...formData, images });
  }

  function handleAddItem() {
    const newItem: CmsSectionItem = {
      id: `item_${Date.now()}`,
      title: 'Nouvel élément',
      description: 'Description de l\'élément'
    };
    setFormData(prev => prev ? ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }) : null);
  }

  function handleUpdateItem(id: string, field: string, value: string) {
    setFormData(prev => prev ? ({
      ...prev,
      items: (prev.items || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }) : null);
  }

  function handleRemoveItem(id: string) {
    setFormData(prev => prev ? ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== id)
    }) : null);
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
              Modifier : {formData.name}
            </h3>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              Page : {formData.pageSlug} • Type : {formData.type}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 8, color: 'var(--text-muted)'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex', gap: 8, padding: '12px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-primary)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('texts')}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: activeTab === 'texts' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'texts' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Textes & Boutons
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: activeTab === 'images' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'images' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Images ({formData.images?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('items')}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: activeTab === 'items' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'items' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Éléments / Liste ({formData.items?.length || 0})
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 'texts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Nom d'identification de la section
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Badge / Surtitre (Optionnel)
                </label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Ex: À Propos, Nos Solutions..."
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Titre principal
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de la section"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Sous-titre / Description courte
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Sous-titre"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Description complète / Paragraphe
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Texte explicatif..."
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Texte Bouton Principal
                  </label>
                  <input
                    type="text"
                    value={formData.primaryBtnText || ''}
                    onChange={e => setFormData({ ...formData, primaryBtnText: e.target.value })}
                    placeholder="Ex: Soumettre une demande"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                      background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Lien Bouton Principal
                  </label>
                  <input
                    type="text"
                    value={formData.primaryBtnUrl || ''}
                    onChange={e => setFormData({ ...formData, primaryBtnUrl: e.target.value })}
                    placeholder="Ex: /contact ou #demande"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                      background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Texte Bouton Secondaire
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryBtnText || ''}
                    onChange={e => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                    placeholder="Ex: Découvrir nos solutions"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                      background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Lien Bouton Secondaire
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryBtnUrl || ''}
                    onChange={e => setFormData({ ...formData, secondaryBtnUrl: e.target.value })}
                    placeholder="Ex: /nos-solutions"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                      background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Image Upload Controls */}
              <div style={{
                padding: 16, background: 'var(--bg-primary)', borderRadius: 12, border: '1px dashed var(--border)',
                display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Ajouter une nouvelle image
                </div>
                
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <label style={{
                    padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    color: 'var(--text-primary)'
                  }}>
                    <Upload size={14} />
                    Importer un fichier local
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>ou par URL ci-dessous</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
                  <input
                    type="text"
                    value={newImageInput}
                    onChange={e => setNewImageInput(e.target.value)}
                    placeholder="URL de l'image (Ex: /images/photo.jpg ou https://...)"
                    style={{
                      padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
                      background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12
                    }}
                  />
                  <input
                    type="text"
                    value={newImageName}
                    onChange={e => setNewImageName(e.target.value)}
                    placeholder="Nom / Légende de l'image"
                    style={{
                      padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
                      background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    style={{
                      padding: '8px 12px', borderRadius: 6, border: 'none', background: 'var(--accent)',
                      color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Ajouter URL
                  </button>
                </div>
              </div>

              {/* Current Images List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                  Images associées ({formData.images?.length || 0})
                </div>

                {(!formData.images || formData.images.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                    Aucune image pour cette section.
                  </div>
                ) : (
                  formData.images.map((img, idx) => (
                    <div key={img.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: 10,
                      background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)'
                    }}>
                      <div style={{
                        width: 54, height: 54, borderRadius: 8, overflow: 'hidden', background: '#000',
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input
                          type="text"
                          value={img.name}
                          onChange={e => {
                            const images = [...(formData.images || [])];
                            images[idx].name = e.target.value;
                            setFormData({ ...formData, images });
                          }}
                          style={{
                            width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border)',
                            background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600
                          }}
                        />
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {img.url}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" onClick={() => handleMoveImage(idx, 'up')} disabled={idx === 0}
                          style={{ padding: 6, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>
                          <MoveUp size={14} />
                        </button>
                        <button type="button" onClick={() => handleMoveImage(idx, 'down')} disabled={idx === (formData.images?.length || 0) - 1}
                          style={{ padding: 6, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: idx === (formData.images?.length || 0) - 1 ? 'not-allowed' : 'pointer' }}>
                          <MoveDown size={14} />
                        </button>
                        <button type="button" onClick={() => handleRemoveImage(img.id)}
                          style={{ padding: 6, borderRadius: 6, border: '1px solid var(--border)', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                  Liste d'éléments / cartes dans la section ({formData.items?.length || 0})
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  style={{
                    padding: '6px 12px', borderRadius: 8, background: 'var(--accent)', color: '#fff',
                    border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Plus size={14} /> Ajouter un élément
                </button>
              </div>

              {(!formData.items || formData.items.length === 0) ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                  Aucun sous-élément dans cette section.
                </div>
              ) : (
                formData.items.map((item, idx) => (
                  <div key={item.id} style={{
                    padding: 16, background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column', gap: 10
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>Élément #{idx + 1}</span>
                      <button type="button" onClick={() => handleRemoveItem(item.id)}
                        style={{ padding: 4, borderRadius: 4, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={e => handleUpdateItem(item.id, 'title', e.target.value)}
                      placeholder="Titre de l'élément"
                      style={{
                        padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
                        background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600
                      }}
                    />

                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                      placeholder="Description de l'élément"
                      style={{
                        padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
                        background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, resize: 'vertical'
                      }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input
                        type="text"
                        value={item.imageUrl || ''}
                        onChange={e => handleUpdateItem(item.id, 'imageUrl', e.target.value)}
                        placeholder="Image URL (Optionnel)"
                        style={{
                          padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)',
                          background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 11
                        }}
                      />
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={e => handleUpdateItem(item.id, 'badge', e.target.value)}
                        placeholder="Badge / Catégorie (Optionnel)"
                        style={{
                          padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)',
                          background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 11
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer actions */}
          <div style={{
            marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)',
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
              <Check size={16} /> Enregistrer la section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
