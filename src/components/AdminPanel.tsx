import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, MAX_LOGIN_ATTEMPTS, LOCK_SECONDS } from '../data';
import { supabase } from '../lib/supabase';
import { useSiteData } from '../lib/siteData';
import AdminHeader from './admin/AdminHeader';
import StatsRow from './admin/StatsRow';
import CatalogHealth from './admin/CatalogHealth';
import BackupManager from './admin/BackupManager';
import CoursesTable from './admin/CoursesTable';
import PromosTable from './admin/PromosTable';
import PasswordForm from './admin/PasswordForm';

interface AdminSession {
  email: string | null;
}

const SESSION_KEY = 'sos_admin_session';

function readLocalSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function writeLocalSession(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // sessão não persiste, login continua válido para a aba atual
  }
}

function clearLocalSession(): void {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignorar
  }
}

export default function AdminPanel() {
  const { reload } = useSiteData();
  const navigate = useNavigate();
  const [sessionState, setSessionState] = useState<AdminSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('is-loading');
    setSessionState(readLocalSession() ? { email: ADMIN_EMAIL } : null);
    setChecking(false);
  }, []);

  const handleAuth = (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    if (Date.now() < lockUntil) {
      setAuthError(`Muitas tentativas. Aguarde ${Math.ceil((lockUntil - Date.now()) / 1000)} segundos.`);
      return;
    }
    if (username.trim().toLowerCase() !== ADMIN_USERNAME) {
      setAuthError('Usuário inválido.');
      return;
    }
    if (password !== ADMIN_PASSWORD) {
      const next = failCount + 1;
      setFailCount(next);
      if (next >= MAX_LOGIN_ATTEMPTS) {
        setLockUntil(Date.now() + LOCK_SECONDS * 1000);
        setFailCount(0);
        setAuthError(`Muitas tentativas de login. Aguarde ${LOCK_SECONDS} segundos.`);
      } else {
        setAuthError(`Senha inválida (tentativa ${next} de ${MAX_LOGIN_ATTEMPTS})`);
      }
      return;
    }
    setFailCount(0);
    writeLocalSession();
    setSessionState({ email: ADMIN_EMAIL });
  };

  const handleSignOut = () => {
    clearLocalSession();
    setSessionState(null);
    navigate('/');
  };

  const handleTogglePasswordForm = () => {
    setShowPasswordForm((current) => !current);
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
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <ArrowLeft strokeWidth={2.4} /> Voltar ao site
          </button>
        </div>
      </div>
    );
  }

  if (!sessionState) {
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
          <button className="admin-link" onClick={() => navigate('/')}>
            ← Voltar ao site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <AdminHeader
        onTogglePasswordForm={handleTogglePasswordForm}
        showPasswordForm={showPasswordForm}
        onSignOut={handleSignOut}
      />
      <PasswordForm showPasswordForm={showPasswordForm} onClose={() => setShowPasswordForm(false)} />
      <main className="container admin-main">
        <StatsRow />
        <CatalogHealth />
        <BackupManager onRestored={reload} />
        <CoursesTable onSaved={reload} />
        <PromosTable onSaved={reload} />
      </main>
    </div>
  );
}