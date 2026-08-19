import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  Database,
  GraduationCap,
  KeyRound,
  LogOut,
  Plus,
  Save,
  Search,
  Sparkles,
  Tag,
  Target,
  Timer,
  Trash2,
  Upload,
} from 'lucide-react';
import { brl, CATEGORIES, COURSES, PROMOS, type Course, type Promo } from '../data';
import { supabase } from '../lib/supabase';
import { useSiteData } from '../lib/siteData';

const PROMO_ICON_OPTIONS = [
  'promo-icon-excel.webp',
  'promo-icon-celular.webp',
  'promo-icon-megafone.webp',
  'promo-icon-codigo.webp',
  'promo-icon-chat.webp',
];

const ADMIN_USERNAME = 'admin.azize';
const ADMIN_EMAIL = 'admin.azize@soscursos.com';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_SECONDS = 60;

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

function isAdminEmail(email: string | null): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}

export default function AdminPanel() {
  const { reload } = useSiteData();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    const client = supabase;
    client.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user.email ?? null;
      if (!isAdminEmail(sessionEmail)) {
        client.auth.signOut();
        setSession(null);
      } else {
        setSession({ email: sessionEmail });
      }
      setChecking(false);
    });
    const { data: subscription } = client.auth.onAuthStateChange((_event, currentSession) => {
      if (!currentSession) {
        setSession(null);
        return;
      }
      const sessionEmail = currentSession.user.email ?? null;
      if (!isAdminEmail(sessionEmail)) {
        client.auth.signOut();
        setSession(null);
        setAuthError('Acesso restrito ao administrador.');
        return;
      }
      setSession({ email: sessionEmail });
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    if (!supabase) return;
    if (Date.now() < lockUntil) {
      setAuthError(`Muitas tentativas. Aguarde ${Math.ceil((lockUntil - Date.now()) / 1000)} segundos.`);
      return;
    }
    if (username.trim().toLowerCase() !== ADMIN_USERNAME) {
      setAuthError('Usuário inválido.');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    if (error) {
      const next = failCount + 1;
      setFailCount(next);
      if (next >= MAX_LOGIN_ATTEMPTS) {
        setLockUntil(Date.now() + LOCK_SECONDS * 1000);
        setFailCount(0);
        setAuthError(`Muitas tentativas de login. Aguarde ${LOCK_SECONDS} segundos.`);
      } else {
        setAuthError(`${error.message} (tentativa ${next} de ${MAX_LOGIN_ATTEMPTS})`);
      }
      return;
    }
    setFailCount(0);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  const handlePasswordChange = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordMsg('');
    if (!supabase) return;
    if (newPassword.length < 8) {
      setPasswordMsg('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPasswordMsg('As senhas não conferem.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg(`Não foi possível alterar: ${error.message}`);
      return;
    }
    setPasswordMsg('Senha alterada com sucesso!');
    setNewPassword('');
    setNewPasswordConfirm('');
    setShowPasswordForm(false);
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
          <p className="admin-login-note">Acesso restrito ao administrador do site.</p>
          <form className="admin-form" onSubmit={handleAuth}>
            <label>
              Usuário
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin.azize"
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit" className="btn btn-primary" disabled={Date.now() < lockUntil}>
              Entrar
            </button>
          </form>
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
            <span className="admin-session">Conectado: {ADMIN_USERNAME}</span>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setShowPasswordForm((current) => !current);
                setPasswordMsg('');
              }}
            >
              <KeyRound strokeWidth={2.4} /> Trocar senha
            </button>
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
        {showPasswordForm && (
          <section className="admin-section admin-section-compact">
            <div className="admin-section-head">
              <div>
                <p className="eyebrow">Segurança</p>
                <h3>Alterar senha do administrador</h3>
              </div>
            </div>
            <form className="admin-form admin-form-inline" onSubmit={handlePasswordChange}>
              <label>
                Nova senha (mínimo 8 caracteres)
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </label>
              <label>
                Repetir nova senha
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={newPasswordConfirm}
                  onChange={(event) => setNewPasswordConfirm(event.target.value)}
                  placeholder="••••••••"
                />
              </label>
              {passwordMsg && <p className="admin-status">{passwordMsg}</p>}
              <button type="submit" className="btn btn-primary">
                Salvar nova senha
              </button>
            </form>
          </section>
        )}

        <StatsRow />

        <CoursesEditor onSaved={reload} />
        <PromosEditor onSaved={reload} />
      </main>
    </div>
  );
}

function StatsRow() {
  const { courses, promos } = useSiteData();
  const adults = courses.filter((course) => !course.kids);
  const kids = courses.length - adults.length;
  const average = adults.length ? adults.reduce((sum, course) => sum + course.price, 0) / adults.length : 0;

  return (
    <div className="admin-stats">
      <div className="admin-stat">
        <GraduationCap strokeWidth={2.2} />
        <strong>{courses.length}</strong>
        <span>Cursos no catálogo</span>
      </div>
      <div className="admin-stat">
        <Tag strokeWidth={2.2} />
        <strong>{promos.length}</strong>
        <span>Promoções ativas</span>
      </div>
      <div className="admin-stat">
        <Target strokeWidth={2.2} />
        <strong>{brl(average)}</strong>
        <span>Preço médio</span>
      </div>
      <div className="admin-stat">
        <Sparkles strokeWidth={2.2} />
        <strong>{kids}</strong>
        <span>Cursos Kids</span>
      </div>
    </div>
  );
}

function CoursesEditor({ onSaved }: { onSaved: () => void }) {
  const { courses, configured } = useSiteData();
  const [drafts, setDrafts] = useState<CourseDraft[]>(() => toCourseDrafts(courses));
  const [query, setQuery] = useState('');
  const [kidsFilter, setKidsFilter] = useState<'all' | 'adult' | 'kids'>('all');
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
      .filter(({ draft }) => !q || draft.name.toLowerCase().includes(q))
      .filter(({ draft }) => kidsFilter === 'all' || (kidsFilter === 'kids' ? draft.kids : !draft.kids));
  }, [drafts, query, kidsFilter]);

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

      <div className="admin-mini-chips" role="group" aria-label="Filtrar por público">
        {(
          [
            ['all', 'Todos'],
            ['adult', 'Adultos'],
            ['kids', 'Kids'],
          ] as const
        ).map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={`admin-mini-chip${kidsFilter === value ? ' active' : ''}`}
            aria-pressed={kidsFilter === value}
            onClick={() => setKidsFilter(value)}
          >
            {label}
          </button>
        ))}
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