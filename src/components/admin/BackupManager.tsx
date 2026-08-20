import { useRef, useState, type ChangeEvent } from 'react';
import { DatabaseBackup, Download, RefreshCcw, Upload } from 'lucide-react';
import { COURSES, PROMOS } from '../../data';
import { supabase } from '../../lib/supabase';
import { useSiteData } from '../../lib/siteData';

interface BackupPayload {
  app?: string;
  exportedAt?: string;
  courses?: unknown[];
  promos?: unknown[];
}

interface BackupManagerProps {
  onRestored: () => void;
}

export default function BackupManager({ onRestored }: BackupManagerProps) {
  const { courses, promos } = useSiteData();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const exportBackup = () => {
    const payload: BackupPayload = {
      app: 'sos-escola',
      exportedAt: new Date().toISOString(),
      courses,
      promos,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sos-escola-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(`Backup salvo com ${courses.length} cursos e ${promos.length} promoções. Guarde o arquivo em lugar seguro.`);
  };

  const restoreDefault = async () => {
    if (!supabase) return;
    if (
      !window.confirm(
        'Restaurar o catálogo padrão do site?\n\nCursos e promoções ausentes serão adicionados e os existentes serão atualizados para os valores padrão. Nada é apagado.'
      )
    )
      return;
    setBusy(true);
    setStatus('');
    const [coursesResult, promosResult] = await Promise.all([
      supabase.from('courses').upsert(
        COURSES.map((course) => ({
          name: course.name,
          category: course.category,
          hours: course.hours,
          price: course.price,
          kids: Boolean(course.kids),
        })),
        { onConflict: 'name' }
      ),
      supabase.from('promos').upsert(
        PROMOS.map((promo) => ({
          name: promo.name,
          hours: promo.hours,
          from_price: promo.from,
          price: promo.price,
          icon: promo.icon,
        })),
        { onConflict: 'name' }
      ),
    ]);
    setBusy(false);
    if (coursesResult.error || promosResult.error) {
      setStatus(
        `Erro ao restaurar: ${coursesResult.error?.message ?? promosResult.error?.message ?? 'desconhecido'}`
      );
      return;
    }
    setStatus(`Catálogo padrão restaurado: ${COURSES.length} cursos e ${PROMOS.length} promoções.`);
    await onRestored();
  };

  const restoreFromFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !supabase) return;
    setBusy(true);
    setStatus('');
    try {
      const parsed = JSON.parse(await file.text()) as BackupPayload;
      const rowsCourses = Array.isArray(parsed.courses) ? parsed.courses : [];
      const rowsPromos = Array.isArray(parsed.promos) ? parsed.promos : [];
      if (!rowsCourses.length && !rowsPromos.length) {
        throw new Error('arquivo sem cursos/promoções válidos');
      }
      if (rowsCourses.length) {
        const { error } = await supabase.from('courses').upsert(
          rowsCourses.map((row) => {
            const value = row as Record<string, unknown>;
            return {
              name: String(value.name ?? '').trim(),
              category: String(value.category ?? 'Informática & Tecnologia'),
              hours: Number(value.hours) || 0,
              price: Number(value.price) || 0,
              kids: Boolean(value.kids),
            };
          }),
          { onConflict: 'name' }
        );
        if (error) throw new Error(`cursos: ${error.message}`);
      }
      if (rowsPromos.length) {
        const { error } = await supabase.from('promos').upsert(
          rowsPromos.map((row) => {
            const value = row as Record<string, unknown>;
            return {
              name: String(value.name ?? '').trim(),
              hours: Number(value.hours) || 0,
              from_price: Number(value.from ?? value.from_price) || 0,
              price: Number(value.price) || 0,
              icon: String(value.icon ?? ''),
            };
          }),
          { onConflict: 'name' }
        );
        if (error) throw new Error(`promoções: ${error.message}`);
      }
      setStatus(`Backup restaurado: ${rowsCourses.length} cursos e ${rowsPromos.length} promoções.`);
      await onRestored();
    } catch (error) {
      setStatus(
        `Falha ao restaurar: ${error instanceof Error ? error.message : 'arquivo inválido'}`
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <div>
          <p className="eyebrow">Segurança</p>
          <h3>Backup & Recuperação</h3>
        </div>
        <div className="admin-section-actions">
          <button type="button" className="btn btn-outline" onClick={exportBackup}>
            <Download strokeWidth={2.4} /> Baixar backup JSON
          </button>
          <button type="button" className="btn btn-outline" onClick={() => fileRef.current?.click()} disabled={busy}>
            <Upload strokeWidth={2.4} /> Restaurar backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="admin-file-input"
            onChange={restoreFromFile}
            aria-label="Arquivo de backup JSON"
          />
          <button type="button" className="btn btn-primary" onClick={restoreDefault} disabled={busy}>
            <RefreshCcw strokeWidth={2.4} /> Restaurar catálogo padrão
          </button>
        </div>
      </div>

      {status && <p className="admin-status" aria-live="polite">{status}</p>}

      <p className="admin-hint">
        <DatabaseBackup strokeWidth={2} /> Baixe um backup antes de grandes mudanças e guarde o arquivo. Para
        restaurar, escolha o arquivo de backup ou use o botão que recria o catálogo padrão do site (nada é apagado).
      </p>
    </section>
  );
}