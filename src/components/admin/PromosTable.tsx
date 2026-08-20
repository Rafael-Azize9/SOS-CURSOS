import { useEffect, useState } from 'react';
import { Plus, Save, Tag, Timer, Trash2, Upload } from 'lucide-react';
import { PROMOS, PROMO_ICON_OPTIONS, type Promo } from '../../data';
import { supabase } from '../../lib/supabase';
import { useSiteData } from '../../lib/siteData';

interface PromoDraft {
  id: string | null;
  name: string;
  hours: number;
  from: number;
  price: number;
  icon: string;
}

interface PromosTableProps {
  onSaved: () => void;
}

export default function PromosTable({ onSaved }: PromosTableProps) {
  const { promos } = useSiteData();
  const [drafts, setDrafts] = useState<PromoDraft[]>(() => toPromoDrafts(promos));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setDrafts(toPromoDrafts(promos));
  }, [promos]);

  const updateDraft = (index: number, patch: Partial<PromoDraft>) => {
    setDrafts((current) => current.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)));
  };

  const addDraft = () => {
    setDrafts((current) => [
      ...current,
      { id: null, name: '', hours: 20, from: 99.9, price: 79.9, icon: 'promo-icon-excel.webp' },
    ]);
  };

  const removeDraft = (index: number) => {
    setDrafts((current) => current.filter((_, i) => i !== index));
  };

  const saveDraft = async (draft: PromoDraft) => {
    if (!supabase || !draft.name.trim()) return;
    setBusy(true);
    setStatus('');
    const payload = {
      name: draft.name.trim(),
      hours: Number(draft.hours),
      from_price: Number(draft.from),
      price: Number(draft.price),
      icon: draft.icon,
    };
    const { error } = draft.id
      ? await supabase.from('promos').update(payload).eq('id', draft.id)
      : await supabase.from('promos').insert(payload);
    setBusy(false);
    if (error) {
      setStatus(`Erro ao salvar a promoção "${draft.name}": ${error.message}`);
      return;
    }
    setStatus(`Promoção "${draft.name}" salva.`);
    await onSaved();
  };

  const deleteDraft = async (draft: PromoDraft) => {
    if (!supabase || !draft.id) {
      removeDraft(drafts.indexOf(draft));
      return;
    }
    if (!window.confirm(`Excluir a promoção "${draft.name}"?`)) return;
    setBusy(true);
    const { error } = await supabase.from('promos').delete().eq('id', draft.id);
    setBusy(false);
    if (error) {
      setStatus(`Erro ao excluir a promoção "${draft.name}": ${error.message}`);
      return;
    }
    setStatus(`Promoção "${draft.name}" excluída.`);
    await onSaved();
  };

  const importLocal = async () => {
    if (!supabase) return;
    if (!window.confirm('Importar as promoções padrão?')) return;
    setBusy(true);
    setStatus('');
    const { error } = await supabase.from('promos').upsert(
      PROMOS.map((promo) => ({
        name: promo.name,
        hours: promo.hours,
        from_price: promo.from,
        price: promo.price,
        icon: promo.icon,
      })),
      { onConflict: 'name' }
    );
    setBusy(false);
    if (error) {
      setStatus(`Erro ao importar: ${error.message}`);
      return;
    }
    setStatus('Promoções padrão importadas.');
    await onSaved();
  };

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <div>
          <p className="eyebrow">Ofertas</p>
          <h3>Promoções ({promos.length})</h3>
        </div>
        <div className="admin-section-actions">
          <button type="button" className="btn btn-outline" onClick={importLocal} disabled={busy}>
            <Upload strokeWidth={2.4} /> Importar promoções padrão
          </button>
          <button type="button" className="btn btn-primary" onClick={addDraft}>
            <Plus strokeWidth={2.4} /> Adicionar promoção
          </button>
        </div>
      </div>

      {status && <p className="admin-status" aria-live="polite">{status}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Carga (h)</th>
              <th>De (R$)</th>
              <th>Por (R$)</th>
              <th>Desconto</th>
              <th>Ícone</th>
              <th aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft, index) => {
              const discount =
                draft.from > draft.price && draft.from > 0
                  ? Math.round((1 - draft.price / draft.from) * 100)
                  : 0;
              return (
                <tr key={draft.id ?? `new-${index}`}>
                  <td>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(event) => updateDraft(index, { name: event.target.value })}
                      aria-label="Nome da promoção"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={draft.hours}
                      onChange={(event) => updateDraft(index, { hours: Number(event.target.value) })}
                      aria-label="Carga horária"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={draft.from}
                      onChange={(event) => updateDraft(index, { from: Number(event.target.value) })}
                      aria-label="Preço original"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={draft.price}
                      onChange={(event) => updateDraft(index, { price: Number(event.target.value) })}
                      aria-label="Preço promocional"
                    />
                  </td>
                  <td>
                    {discount > 0 ? (
                      <span className="admin-discount">-{discount}%</span>
                    ) : (
                      <span className="admin-discount muted">—</span>
                    )}
                  </td>
                  <td>
                    <select
                      value={draft.icon}
                      onChange={(event) => updateDraft(index, { icon: event.target.value })}
                      aria-label="Ícone"
                    >
                      <option value="">Nenhum</option>
                      {PROMO_ICON_OPTIONS.map((icon: string) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-icon-btn save"
                        onClick={() => saveDraft(draft)}
                        disabled={busy || !draft.name.trim()}
                        aria-label={`Salvar promoção ${draft.name || 'nova'}`}
                        title="Salvar"
                      >
                        <Save strokeWidth={2.2} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => deleteDraft(draft)}
                        disabled={busy}
                        aria-label={`Excluir promoção ${draft.name || 'nova'}`}
                        title="Excluir"
                      >
                        <Trash2 strokeWidth={2.2} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="admin-hint">
        <Tag strokeWidth={2} /> As promoções aparecem no catálogo com o selo <strong>Promo</strong> e o preço antigo
        riscado. <Timer strokeWidth={2} /> Clique em salvar para publicar.
      </p>
    </section>
  );
}

function toPromoDrafts(promos: Promo[]): PromoDraft[] {
  return promos.map((promo) => ({
    id: promo.id ?? null,
    name: promo.name,
    hours: promo.hours,
    from: promo.from,
    price: promo.price,
    icon: promo.icon,
  }));
}