import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, Database, LogOut, Plus, Save, Search, Tag, Timer, Trash2, Upload } from 'lucide-react';
import { CATEGORIES, COURSES, PROMOS, type Course, type Promo } from '../data';
import { supabase } from '../lib/supabase';
import { useSiteData } from '../lib/siteData';

const PROMO_ICON_OPTIONS = [
  'promo-icon-excel.webp',
  'promo-icon-celular.webp',
  'promo-icon-megafone.webp',
  'promo-icon-codigo.webp',
  'promo-icon-chat.webp',
];

interface AdminSession {
  email: string | null;
}

interface CourseDraft {
  id: string | null;
  name: string;
  category: string;
  hours: number;
  price: number;
  kids: boolean;
}

interface PromoDraft {
  id: string | null;
  name: string;
  hours: number;
  from: number;
  price: number;
  icon: string;
}

export default function AdminPanel() {
  const { reload } = useSiteData();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ? { email: data.session.user.email ?? null } : null);
      setChecking(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession ? { email: currentSession.user.email ?? null } : null);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    if (!supabase) return;
    const action = mode === 'login' ? 'signInWithPassword' : 'signUp';
    const { error } = await supabase.auth[action]({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    if (mode === 'signup') setMode('login');
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  if (checking) {
    return (
      <div className="admin-shell">
        <p className="admin-message">Carregando painel...</p>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="admin-shell">
        <div className="admin-card">
          <p className="eyebrow">Configuração pendente</p>
          <h2>Banco de dados não configurado</h2>
          <p className="admin-message">
            Crie as variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo{' '}
            <code>.env</code> e rode o script <code>supabase-setup.sql</code> no SQL Editor do Supabase. Veja o
            README do projeto para o passo a passo.
          </p>
          <a className="btn btn-primary" href="#topo">
            <ArrowLeft strokeWidth={2.4} /> Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-shell">
        <div className="admin-card">
          <p className="eyebrow">Painel de administração</p>
          <h2>Entrar</h2>
          <form className="admin-form" onSubmit={handleAuth}>
            <label>
              E-mail
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit" className="btn btn-primary">
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
          <button type="button" className="admin-link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Ainda não tenho conta — criar agora' : 'Já tenho conta — entrar'}
          </button>
          <a className="admin-link" href="#topo">
            ← Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="container admin-header-row">
          <div className="admin-title">
            <Database strokeWidth={2.2} />
            <div>
              <p className="eyebrow">Banco de dados</p>
              <h2>Painel de administração</h2>
            </div>
          </div>
          <div className="admin-header-actions">
            <span className="admin-session">{session.email}</span>
            <a className="btn btn-outline" href="#topo">
              <ArrowLeft strokeWidth={2.4} /> Ver site
            </a>
            <button type="button" className="btn btn-secondary" onClick={handleSignOut}>
              <LogOut strokeWidth={2.4} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container admin-main">
        <CoursesEditor onSaved={reload} />
        <PromosEditor onSaved={reload} />
      </main>
    </div>
  );
}

function CoursesEditor({ onSaved }: { onSaved: () => void }) {
  const { courses, configured } = useSiteData();
  const [drafts, setDrafts] = useState<CourseDraft[]>(() => toCourseDrafts(courses));
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setDrafts(toCourseDrafts(courses));
  }, [courses]);

  const updateDraft = (index: number, patch: Partial<CourseDraft>) => {
    setDrafts((current) => current.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)));
  };

  const addDraft = () => {
    setDrafts((current) => [
      ...current,
      { id: null, name: '', category: CATEGORIES[1], hours: 20, price: 69.9, kids: false },
    ]);
  };

  const removeDraft = (index: number) => {
    setDrafts((current) => current.filter((_, i) => i !== index));
  };

  const saveDraft = async (draft: CourseDraft) => {
    if (!supabase || !draft.name.trim()) return;
    setBusy(true);
    setStatus('');
    const payload = {
      name: draft.name.trim(),
      category: draft.category,
      hours: Number(draft.hours),
      price: Number(draft.price),
      kids: draft.kids,
    };
    const { error } = draft.id
      ? await supabase.from('courses').update(payload).eq('id', draft.id)
      : await supabase.from('courses').insert(payload);
    setBusy(false);
    if (error) {
      setStatus(`Erro ao salvar "${draft.name}": ${error.message}`);
      return;
    }
    setStatus(`Curso "${draft.name}" salvo.`);
    await onSaved();
  };

  const deleteDraft = async (draft: CourseDraft) => {
    if (!supabase || !draft.id) {
      removeDraft(drafts.indexOf(draft));
      return;
    }
    if (!window.confirm(`Excluir o curso "${draft.name}"?`)) return;
    setBusy(true);
    const { error } = await supabase.from('courses').delete().eq('id', draft.id);
    setBusy(false);
    if (error) {
      setStatus(`Erro ao excluir "${draft.name}": ${error.message}`);
      return;
    }
    setStatus(`Curso "${draft.name}" excluído.`);
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
      }))
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
    return drafts
      .map((draft, index) => ({ draft, index }))
      .filter(({ draft }) => !q || draft.name.toLowerCase().includes(q));
  }, [drafts, query]);

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
          <button type="button" className="btn btn-primary" onClick={addDraft}>
            <Plus strokeWidth={2.4} /> Adicionar curso
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
              <th>Preço (R$)</th>
              <th>Kids</th>
              <th aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ draft, index }) => (
              <tr key={draft.id ?? `new-${index}`}>
                <td>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(event) => updateDraft(index, { name: event.target.value })}
                    aria-label="Nome do curso"
                  />
                </td>
                <td>
                  <select
                    value={draft.category}
                    onChange={(event) => updateDraft(index, { category: event.target.value })}
                    aria-label="Categoria"
                  >
                    {CATEGORIES.filter((category) => category !== 'Todos').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
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
                    value={draft.price}
                    onChange={(event) => updateDraft(index, { price: Number(event.target.value) })}
                    aria-label="Preço"
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={draft.kids}
                    onChange={(event) => updateDraft(index, { kids: event.target.checked })}
                    aria-label="Curso Kids"
                  />
                </td>
                <td>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-icon-btn save"
                      onClick={() => saveDraft(draft)}
                      disabled={busy || !draft.name.trim()}
                      aria-label={`Salvar ${draft.name || 'curso'}`}
                      title="Salvar"
                    >
                      <Save strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      onClick={() => deleteDraft(draft)}
                      disabled={busy}
                      aria-label={`Excluir ${draft.name || 'curso'}`}
                      title="Excluir"
                    >
                      <Trash2 strokeWidth={2.2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PromosEditor({ onSaved }: { onSaved: () => void }) {
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
      }))
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
              <th>Ícone</th>
              <th aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft, index) => (
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
                  <select
                    value={draft.icon}
                    onChange={(event) => updateDraft(index, { icon: event.target.value })}
                    aria-label="Ícone"
                  >
                    <option value="">Nenhum</option>
                    {PROMO_ICON_OPTIONS.map((icon) => (
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
            ))}
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

function toCourseDrafts(courses: Course[]): CourseDraft[] {
  return courses.map((course) => ({
    id: course.id ?? null,
    name: course.name,
    category: course.category,
    hours: course.hours,
    price: course.price,
    kids: Boolean(course.kids),
  }));
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