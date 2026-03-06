import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EDGE_FUNCTION_BASE } from '../common/util/apiUrl';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    company_name: '',
    traccar_url: '',
    owner_email: '',
    color_primary: '#00f5a0',
    color_secondary: '#ffffff',
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const canAdvance = () => {
    if (step === 1) return form.company_name.trim().length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.owner_email);
    if (step === 2) {
      try { new URL(form.traccar_url); return true; } catch { return false; }
    }
    return true;
  };

  const handleSubmit = async () => {
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
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.data);
        localStorage.setItem('tenantSlug', data.data.slug);
        setStep(4);
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
    width: '100%',
    padding: '14px 16px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 6,
  };

  const btnPrimary = {
    width: '100%',
    padding: '14px 0',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 15,
    background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
    color: '#0a0a0f',
    fontFamily: 'inherit',
    opacity: canAdvance() && !loading ? 1 : 0.5,
    pointerEvents: canAdvance() && !loading ? 'auto' : 'none',
  };

  const btnSecondary = {
    width: '100%',
    padding: '12px 0',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    background: 'transparent',
    color: '#94a3b8',
    fontFamily: 'inherit',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#0a0a0f',
          }}>H</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>
            {step === 4 ? '🎉 Conta Criada!' : 'Criar sua conta'}
          </h1>
          {step < 4 && (
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
              Passo {step} de 3 — {step === 1 ? 'Dados da Empresa' : step === 2 ? 'Servidor Traccar' : 'Personalização'}
            </p>
          )}
        </div>

        {/* Progress */}
        {step < 4 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: s <= step ? 'linear-gradient(135deg, #00f5a0, #00d9f5)' : 'rgba(255,255,255,0.08)',
              }} />
            ))}
          </div>
        )}

        <div style={{
          padding: 28,
          borderRadius: 16,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Step 1 - Company Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Nome da Empresa *</label>
                <input
                  type="text"
                  placeholder="Ex: MabTracker Rastreamento"
                  value={form.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Seu Email *</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.owner_email}
                  onChange={(e) => updateField('owner_email', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <button onClick={() => setStep(2)} style={btnPrimary}>
                Continuar
              </button>
            </div>
          )}

          {/* Step 2 - Traccar URL */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>URL do seu servidor Traccar *</label>
                <input
                  type="url"
                  placeholder="https://traccar.suaempresa.com.br"
                  value={form.traccar_url}
                  onChange={(e) => updateField('traccar_url', e.target.value)}
                  style={inputStyle}
                />
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 1.5 }}>
                  Informe o endereço completo do seu servidor Traccar (com https://)
                </p>
              </div>
              <button onClick={() => setStep(3)} style={btnPrimary}>
                Continuar
              </button>
              <button onClick={() => setStep(1)} style={btnSecondary}>
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 3 - Customization */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Cor Principal</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.color_primary}
                    onChange={(e) => updateField('color_primary', e.target.value)}
                    style={{ width: 48, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={form.color_primary}
                    onChange={(e) => updateField('color_primary', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Cor Secundária</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.color_secondary}
                    onChange={(e) => updateField('color_secondary', e.target.value)}
                    style={{ width: 48, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={form.color_secondary}
                    onChange={(e) => updateField('color_secondary', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>

              {error && (
                <p style={{ color: '#ff6b6b', fontSize: 13, margin: 0 }}>{error}</p>
              )}

              <button onClick={handleSubmit} style={btnPrimary}>
                {loading ? 'Criando conta...' : 'Criar Conta — 7 Dias Grátis'}
              </button>
              <button onClick={() => setStep(2)} style={btnSecondary}>
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 4 - Success */}
          {step === 4 && success && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>
                Sua conta <strong style={{ color: '#00f5a0' }}>{success.company_name}</strong> foi criada com sucesso!
                <br />Seu trial gratuito é válido até{' '}
                <strong style={{ color: '#fff' }}>
                  {new Date(success.trial_ends_at).toLocaleDateString('pt-BR')}
                </strong>.
              </p>
              <div style={{
                padding: 16, borderRadius: 10,
                background: 'rgba(0,245,160,0.06)',
                border: '1px solid rgba(0,245,160,0.15)',
              }}>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>Seu slug de acesso:</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#00f5a0', margin: 0 }}>{success.slug}</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                style={{ ...btnPrimary, opacity: 1, pointerEvents: 'auto' }}
              >
                Ir para o Login
              </button>
              <button onClick={() => navigate('/')} style={btnSecondary}>
                Voltar ao Início
              </button>
            </div>
          )}
        </div>

        {step < 4 && (
          <p style={{ textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 20 }}>
            Já tem uma conta?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#00f5a0', cursor: 'pointer', fontWeight: 600 }}
            >
              Entrar
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
