import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    company_name: '',
    owner_email: '',
    password: '',
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const isValid = form.company_name.trim().length >= 3
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.owner_email)
    && form.password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://foifugnuaehjtjftpkrk.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaWZ1Z251YWVoanRqZnRwa3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDc5MjIsImV4cCI6MjA4ODM4MzkyMn0.4nYVYZu8FCN4-aJ1NxytL-jFRN07VHDZzFYT0dmEDDo';

      const response = await fetch(`${supabaseUrl}/functions/v1/create-tenant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          company_name: form.company_name,
          owner_email: form.owner_email,
          password: form.password,
          traccar_url: 'https://pending-setup.example.com',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.data);
      } else {
        setError(data.message || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
    color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6,
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0a0a0f', color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#0a0a0f',
          }}>H</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>
            {success ? '🎉 Conta Criada!' : 'Criar sua conta'}
          </h1>
          {!success && (
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
              Cadastre sua empresa e comece a usar em minutos
            </p>
          )}
        </div>

        <div style={{
          padding: 28, borderRadius: 16, background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {!success ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Nome da Empresa *</label>
                <input
                  type="text" placeholder="Ex: MabTracker Rastreamento"
                  value={form.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Seu Email *</label>
                <input
                  type="email" placeholder="seu@email.com"
                  value={form.owner_email}
                  onChange={(e) => updateField('owner_email', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Senha * <span style={{ color: '#475569', fontWeight: 400 }}>(mín. 6 caracteres)</span>
                </label>
                <input
                  type="password" placeholder="••••••"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  style={inputStyle}
                />
              </div>

              {error && <p style={{ color: '#ff6b6b', fontSize: 13, margin: 0 }}>{error}</p>}

              <button type="submit" disabled={!isValid || loading} style={{
                width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
                cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
                background: 'linear-gradient(135deg, #00f5a0, #00d9f5)', color: '#0a0a0f',
                opacity: !isValid || loading ? 0.5 : 1,
              }}>
                {loading ? 'Criando conta...' : 'Criar Conta — 7 Dias Grátis'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                Sua empresa <strong style={{ color: '#00f5a0' }}>{success.company_name}</strong> foi criada!
                <br />Trial gratuito até{' '}
                <strong style={{ color: '#fff' }}>
                  {new Date(success.trial_ends_at).toLocaleDateString('pt-BR')}
                </strong>.
              </p>
              <p style={{ color: '#64748b', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                Acesse o painel para configurar seu app: URL do Traccar, logo, cores e WhatsApp.
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
                  background: 'linear-gradient(135deg, #00f5a0, #00d9f5)', color: '#0a0a0f',
                }}
              >
                Entrar no Painel
              </button>
            </div>
          )}
        </div>

        {!success && (
          <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>
              Já tem uma conta?{' '}
              <span onClick={() => navigate('/admin/login')} style={{ color: '#00f5a0', cursor: 'pointer', fontWeight: 600 }}>
                Entrar
              </span>
            </p>
            <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>
              <span onClick={() => navigate('/')} style={{ color: '#64748b', cursor: 'pointer' }}>
                ← Voltar ao início
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
