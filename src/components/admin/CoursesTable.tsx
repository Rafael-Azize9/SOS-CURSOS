import { useEffect, useMemo, useState } from 'react';
import { Save, Search, Upload } from 'lucide-react';
import { COURSES, brl, type Course } from '../../data';
import { supabase } from '../../lib/supabase';
import { useSiteData } from '../../lib/siteData';

interface CoursesTableProps {
  onSaved: () => void;
}

export default function CoursesTable({ onSaved }: CoursesTableProps) {
  const { courses, configured } = useSiteData();
  const [prices, setPrices] = useState<Record<string, number>>(() => priceMap(courses));
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setPrices(priceMap(courses));
  }, [courses]);

  const savePrice = async (course: Course) => {
    if (!supabase || !course.id) return;
    const price = prices[course.id ?? course.name] ?? course.price;
    setBusy(true);
    setStatus('');
    const { error } = await supabase.from('courses').update({ price }).eq('id', course.id);
    setBusy(false);
    if (error) {
      setStatus(`Erro ao salvar "${course.name}": ${error.message}`);
      return;
    }
    setStatus(`Preço de "${course.name}" atualizado para ${brl(price)}.`);
    await onSaved();
  };

  const importLocal = async () => {
    if (!supabase) return;
    if (!window.confirm('Importar o catálogo padrão (novos cursos serão adicionados, existentes serão atualizados)?')) return;
    setBusy(true);
    setStatus('');
    const { error } = await supabase.from('courses').upsert(
      COURSES.map((course) => ({
        name: course.name,
        category: course.category,
        hours: course.hours,
        price: course.price,
        kids: Boolean(course.kids),
      })),
      { onConflict: 'name' }
    );
    setBusy(false);
    if (error) {
      setStatus(`Erro ao importar: ${error.message}`);
      return;
    }
    setStatus('Catálogo padrão importado.');
    await onSaved();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => !q || course.name.toLowerCase().includes(q));
  }, [courses, query]);

  if (!configured) return null;

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h3>Cursos ({courses.length})</h3>
        </div>
        <div className="admin-section-actions">
          <div className="search-box admin-search">
            <Search strokeWidth={2.2} />
            <input
              type="search"
              placeholder="Filtrar cursos..."
              aria-label="Filtrar cursos"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button type="button" className="btn btn-outline" onClick={importLocal} disabled={busy}>
            <Upload strokeWidth={2.4} /> Importar catálogo padrão
          </button>
        </div>
      </div>

      {status && <p className="admin-status" aria-live="polite">{status}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Categoria</th>
              <th>Carga (h)</th>
              <th>Público</th>
              <th>Preço (R$)</th>
              <th aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((course) => {
              const key = course.id ?? course.name;
              return (
                <tr key={key}>
                  <td>{course.name}</td>
                  <td>{course.category}</td>
                  <td>{course.hours}</td>
                  <td>
                    {course.kids ? (
                      <span className="admin-kids-badge">Kids</span>
                    ) : (
                      <span className="admin-muted-text">Adulto</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={prices[key] ?? course.price}
                      onChange={(event) =>
                        setPrices((current) => ({ ...current, [key]: Number(event.target.value) }))
                      }
                      aria-label={`Preço de ${course.name}`}
                    />
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-icon-btn save"
                        onClick={() => savePrice(course)}
                        disabled={busy || (prices[key] ?? course.price) === course.price}
                        aria-label={`Salvar preço de ${course.name}`}
                        title="Salvar preço"
                      >
                        <Save strokeWidth={2.2} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function priceMap(courses: Course[]): Record<string, number> {
  return Object.fromEntries(courses.map((course) => [course.id ?? course.name, course.price]));
}