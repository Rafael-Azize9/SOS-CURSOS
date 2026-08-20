import { ArrowLeft, Database, KeyRound, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onTogglePasswordForm: () => void;
  showPasswordForm: boolean;
  onSignOut: () => void;
}

export default function AdminHeader({
  onTogglePasswordForm,
  showPasswordForm,
  onSignOut,
}: AdminHeaderProps) {
  const navigate = useNavigate();

  return (
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
          <span className="admin-session">Sessão administrativa ativa</span>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onTogglePasswordForm}
          >
            <KeyRound strokeWidth={2.4} /> {showPasswordForm ? 'Fechar' : 'Trocar'} senha
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            <ArrowLeft strokeWidth={2.4} /> Ver site
          </button>
          <button type="button" className="btn btn-secondary" onClick={onSignOut}>
            <LogOut strokeWidth={2.4} /> Sair
          </button>
        </div>
      </div>
    </header>
  );
}