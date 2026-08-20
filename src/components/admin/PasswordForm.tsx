import { useState, type FormEvent } from 'react';
import { KeyRound } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PasswordFormProps {
  showPasswordForm: boolean;
  onClose: () => void;
}

export default function PasswordForm({ showPasswordForm, onClose }: PasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

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
    onClose();
  };

  if (!showPasswordForm) return null;

  return (
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
          <KeyRound strokeWidth={2.4} /> Salvar nova senha
        </button>
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </section>
  );
}