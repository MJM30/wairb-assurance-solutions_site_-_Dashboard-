import { useEffect, useMemo, useState } from 'react';
import {
  Search, Filter, Eye, Home, Car, Building2, AlertTriangle,
  Users, X, Mail, Phone, MapPin, Calendar, CreditCard, CheckCircle, Clock, Edit2, Save, UserPlus, Upload, FileText, DollarSign
} from 'lucide-react';
import { type WairbClient, getMontantByType, getAdminRole } from '../lib/storage';
import { fetchClients, updateClient, updateClientPayment } from '../lib/api';
import NewClientModal from '../components/NewClientModal';

const COLORS: Record<string, string> = {
  habitation: '#16c784', auto: '#3b82f6', professionnelle: '#f59e0b', pvt: '#ef4444',
};
const TYPE_ICONS: Record<string, React.ElementType> = {
  habitation: Home, auto: Car, professionnelle: Building2, pvt: AlertTriangle,
};

function ClientModal({ client, onClose, onRefresh }: { client: WairbClient; onClose: () => void; onRefresh: () => void }) {
  const [saving, setSaving] = useState(false);
  const Icon = TYPE_ICONS[client.typeAssurance] || Users;
  const color = COLORS[client.typeAssurance] || '#3b82f6';
  const [modePaiement, setModePaiement] = useState<'virement' | 'especes' | undefined>(undefined);
  const [preuvePaiement, setPreuvePaiement] = useState<File | null>(null);
  const [preuvePaiementData, setPreuvePaiementData] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Veuillez sélectionner un fichier PDF ou une image (JPEG, PNG, GIF)');
        return;
      }
      setPreuvePaiement(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreuvePaiementData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function togglePayment() {
    if (client.statut !== 'paye') {
      if (!modePaiement) {
        alert('Veuillez sélectionner le mode de paiement (virement ou espèces)');
        return;
      }
      if (!preuvePaiement) {
        alert('Veuillez ajouter une preuve de paiement (PDF ou image)');
        return;
      }
    }

    setSaving(true);
    try {
      await updateClientPayment(
        client.id,
        client.statut !== 'paye',
        getMontantByType(client.typeAssurance),
        client.statut !== 'paye' ? modePaiement : undefined,
        client.statut !== 'paye' ? preuvePaiement?.name : undefined,
        client.statut !== 'paye' ? preuvePaiement?.type : undefined,
        client.statut !== 'paye' ? preuvePaiementData : undefined
      );
      onRefresh();
      setShowPaymentForm(false);
      setModePaiement(undefined);
      setPreuvePaiement(null);
      setPreuvePaiementData('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement :', error);
      alert("Impossible de mettre à jour le paiement.");
    } finally {
      setSaving(false);
    }
  }

  const role = getAdminRole();
  const readonly = role === 'financier';
  const canEdit = role === 'admin' || role === 'percepteur';

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<WairbClient>(client);

  async function handleSave() {
    try {
      await updateClient(editForm.id, {
        nom: editForm.nom,
        email: editForm.email,
        telephone: editForm.telephone,
        adressePhysique: editForm.adressePhysique,
        adressePostale: editForm.adressePostale,
        domaineActivite: editForm.domaineActivite,
        ville: editForm.ville,
        pays: editForm.pays,
        detailsAssurance: editForm.detailsAssurance,
      });
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du client :', error);
      alert("Impossible d'enregistrer les modifications.");
    }
  }

  const infoRows = [
    { key: 'email', icon: Mail, label: 'Adresse email', value: editForm.email },
    { key: 'telephone', icon: Phone, label: 'Téléphone', value: editForm.telephone },
    { key: 'adressePhysique', icon: MapPin, label: 'Adresse physique', value: editForm.adressePhysique || '—' },
    { key: 'ville', icon: MapPin, label: 'Ville', value: editForm.ville },
    { key: 'domaineActivite', icon: Building2, label: "Domaine d'activité", value: editForm.domaineActivite || '—' },
    { key: 'dateInscription', icon: Calendar, label: "Date d'inscription", value: new Date(client.dateInscription).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), readonly: true },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 580 }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${color}18`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                {isEditing ? <input className="input" style={{ height: 26, padding: '0 8px', fontSize: 14 }} value={editForm.nom} onChange={e => setEditForm({...editForm, nom: e.target.value})} /> : client.nom}
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{client.typeAssuranceLabel}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isEditing && canEdit && (
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                <Edit2 size={14} /> Modifier
              </button>
            )}
            {isEditing && (
              <button onClick={handleSave} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                <Save size={14} /> Enregistrer
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Matricule + Statut */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '14px 16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Numéro Matricule
              </p>
              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', fontFamily: 'monospace' }}>{client.matricule}</p>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Statut de paiement
              </p>
              <span className={`badge ${client.statut === 'paye' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: 12 }}>
                {client.statut === 'paye' ? <><CheckCircle size={11} /> Payé</> : <><Clock size={11} /> En attente</>}
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {infoRows.map(({ key, icon: RowIcon, label, value, readonly }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
                <RowIcon size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 140, flexShrink: 0 }}>{label}</span>
                {isEditing && !readonly ? (
                  <input className="input" style={{ height: 26, padding: '0 8px', fontSize: 12, flex: 1 }} value={value} onChange={e => setEditForm({...editForm, [key]: e.target.value})} />
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
                )}
              </div>
            ))}
          </div>

          {/* Paiement info */}
          {client.statut === 'paye' && client.datePaiement && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginBottom: 2 }}>Paiement reçu</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {new Date(client.datePaiement).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>
                  ${(client.montantPaye ?? getMontantByType(client.typeAssurance)).toLocaleString()} USD
                </p>
              </div>
              
              {/* Mode de paiement */}
              {client.modePaiement && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <DollarSign size={14} color="var(--accent)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Mode: {client.modePaiement === 'virement' ? 'Virement bancaire' : 'Espèces'}
                  </span>
                </div>
              )}

              {/* Preuve de paiement */}
              {client.preuvePaiementNom && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <FileText size={14} color="var(--accent)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Preuve: {client.preuvePaiementNom}
                  </span>
                  {client.preuvePaiementData && (
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = client.preuvePaiementData!;
                        link.download = client.preuvePaiementNom!;
                        link.click();
                      }}
                      style={{
                        marginLeft: 'auto',
                        padding: '4px 8px',
                        background: 'var(--accent)',
                        color: '#000',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Télécharger
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Détails spécifiques assurance */}
          {client.detailsAssurance && Object.keys(client.detailsAssurance).length > 0 && (
            <div style={{ marginTop: 8 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Détails du questionnaire
              </h3>
              <div style={{ 
                background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: 16,
                display: 'grid', gridTemplateColumns: '1fr', gap: 12
              }}>
                {Object.entries(client.detailsAssurance).map(([key, value]) => {
                  if (typeof value === 'boolean' || !value || (Array.isArray(value) && value.length === 0)) return null;
                  
                  // Formattage du label (CamelCase vers espace)
                  const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
                  const displayValue = Array.isArray(value) ? value.join(", ") : String(value);

                  return (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'capitalize' }}>
                        {label}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action button */}
          {!readonly && (
            <>
              {client.statut !== 'paye' && showPaymentForm && (
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Informations de paiement
                  </h3>
                  
                  {/* Mode de paiement */}
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Mode de paiement *
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setModePaiement('virement')}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: 8,
                          border: `1px solid ${modePaiement === 'virement' ? 'var(--accent)' : 'var(--border)'}`,
                          background: modePaiement === 'virement' ? 'var(--accent-bg)' : 'var(--bg-card)',
                          color: modePaiement === 'virement' ? 'var(--accent)' : 'var(--text-primary)',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8
                        }}
                      >
                        <DollarSign size={16} />
                        Virement bancaire
                      </button>
                      <button
                        type="button"
                        onClick={() => setModePaiement('especes')}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: 8,
                          border: `1px solid ${modePaiement === 'especes' ? 'var(--accent)' : 'var(--border)'}`,
                          background: modePaiement === 'especes' ? 'var(--accent-bg)' : 'var(--bg-card)',
                          color: modePaiement === 'especes' ? 'var(--accent)' : 'var(--text-primary)',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8
                        }}
                      >
                        <FileText size={16} />
                        Espèces
                      </button>
                    </div>
                  </div>

                  {/* Preuve de paiement */}
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, display: 'block' }}>
                      Preuve de paiement (PDF ou image) *
                    </label>
                    <div style={{
                      position: 'relative',
                      border: '2px dashed var(--border)',
                      borderRadius: 8,
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: preuvePaiement ? 'var(--accent-bg)' : 'var(--bg-card)',
                      borderColor: preuvePaiement ? 'var(--accent)' : 'var(--border)'
                    }}>
                      <input
                        type="file"
                        accept=".pdf,image/jpeg,image/png,image/gif,image/jpg"
                        onChange={handleFileUpload}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <Upload size={24} style={{ color: preuvePaiement ? 'var(--accent)' : 'var(--text-muted)', marginBottom: 8 }} />
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                        {preuvePaiement ? preuvePaiement.name : 'Cliquez pour sélectionner un fichier'}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                        PDF, JPEG, PNG, GIF
                      </p>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setModePaiement(undefined);
                        setPreuvePaiement(null);
                        setPreuvePaiementData('');
                      }}
                      disabled={saving}
                      style={{ flex: 1, height: 38 }}
                    >
                      Annuler
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={togglePayment}
                      disabled={saving || !modePaiement || !preuvePaiement}
                      style={{ flex: 1, height: 38 }}
                    >
                      {saving ? 'Validation...' : `Confirmer — $${getMontantByType(client.typeAssurance)} USD`}
                    </button>
                  </div>
                </div>
              )}

              {!showPaymentForm && (
                <button
                  className={`btn ${client.statut === 'paye' ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => {
                    if (client.statut === 'paye') {
                      togglePayment();
                    } else {
                      setShowPaymentForm(true);
                    }
                  }}
                  disabled={saving}
                  style={{ justifyContent: 'center', height: 42 }}
                >
                  <CreditCard size={15} />
                  {saving ? 'Mise à jour...' : client.statut === 'paye' ? 'Annuler le paiement' : `Marquer comme payé — $${getMontantByType(client.typeAssurance)} USD`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Clients() {
  const role = getAdminRole();
  const [clients, setClients] = useState<WairbClient[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paye' | 'en_attente'>(role === 'percepteur' ? 'en_attente' : 'all');
  const [selected, setSelected] = useState<WairbClient | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  async function refresh() {
    try {
      setLoadError(null);
      const loadedClients = await fetchClients();
      setClients(loadedClients);
      if (selected) {
        const updated = loadedClients.find(c => c.id === selected.id);
        setSelected(updated ?? null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients :', error);
      setLoadError("Impossible de charger les clients. Vérifiez que l'API Next.js (port 3000) est démarrée.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => clients.filter(c => {
    const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.matricule.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.statut === filter;
    return matchSearch && matchFilter;
  }), [clients, search, filter]);

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'paye', label: 'Payés' },
    { key: 'en_attente', label: 'En attente' },
  ];

  if (loading) {
    return (
      <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        Chargement des clients...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {loadError && (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          background: '#fef2f2', border: '1px solid #fecaca',
          color: '#b91c1c', fontSize: 13,
        }}>
          {loadError}
        </div>
      )}
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Tous les clients <span style={{ color: 'var(--accent)', marginLeft: 8 }}>{filtered.length}</span>
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Clientèle complète de WAIRB Assurances
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Nouveau Client Btn */}
          {(role === 'admin' || role === 'percepteur') && (
            <button className="btn btn-primary" style={{ height: 36, padding: '0 12px' }} onClick={() => setShowNew(true)}>
              <UserPlus size={14} /> Nouveau client
            </button>
          )}

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 30, width: 200, height: 36 }}
            />
          </div>
          {/* Filter tabs */}
          {role !== 'percepteur' && (
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    background: filter === f.key ? 'var(--accent)' : 'transparent',
                    color: filter === f.key ? '#000' : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type d'assurance</th>
                <th>Matricule</th>
                <th>Ville</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Montant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => {
                const Icon = TYPE_ICONS[client.typeAssurance] || Users;
                const color = COLORS[client.typeAssurance] || '#3b82f6';
                return (
                  <tr key={client.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(client)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 9,
                          background: `${color}18`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color }}>{client.nom[0]}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{client.nom}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon size={13} color={color} />
                        <span style={{ fontSize: 12 }}>{client.typeAssuranceLabel}</span>
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: 11, color: 'var(--accent)', background: 'var(--accent-bg)', padding: '2px 6px', borderRadius: 4 }}>
                        {client.matricule}
                      </code>
                    </td>
                    <td style={{ fontSize: 12 }}>{client.ville}</td>
                    <td style={{ fontSize: 11 }}>
                      {new Date(client.dateInscription).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                      <span className={`badge ${client.statut === 'paye' ? 'badge-green' : 'badge-yellow'}`}>
                        {client.statut === 'paye' ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: client.montantPaye ? 'var(--accent)' : 'var(--text-muted)' }}>
                      {client.montantPaye ? `$${client.montantPaye}` : '—'}
                    </td>
                    <td>
                      <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={e => { e.stopPropagation(); setSelected(client); }}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    Aucun client trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selected && <ClientModal client={selected} onClose={() => setSelected(null)} onRefresh={refresh} />}
      {showNew && <NewClientModal onClose={() => setShowNew(false)} onRefresh={refresh} />}
    </div>
  );
}
