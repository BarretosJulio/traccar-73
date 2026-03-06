import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('pwa');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }

      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data) {
        navigate('/admin/login');
        return;
      }

      setTenant(data);
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleSave = async () => {
    if (!tenant) return;
    setSaving(true);
    setMessage('');
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          company_name: tenant.company_name,
          color_primary: tenant.color_primary,
          color_secondary: tenant.color_secondary,
          whatsapp_number: tenant.whatsapp_number,
          whatsapp_message: tenant.whatsapp_message,
          logo_url: tenant.logo_url,
          custom_domain: tenant.custom_domain,
          traccar_url: tenant.traccar_url,
        })
        .eq('id', tenant.id);

      if (error) throw error;
      setMessage('Salvo com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const updateField = (field, value) => {
    setTenant((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid rgba(0,245,160,0.2)',
            borderTopColor: '#00f5a0', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>Carregando painel...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
    color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const trialDays = tenant?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const tabs = [
    { id: 'pwa', label: '🎨 Personalizar PWA' },
    { id: 'plan', label: '📋 Plano' },
    { id: 'stats', label: '📊 Estatísticas' },
  ];

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0a0a0f', color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 14, color: '#0a0a0f',
          }}>H</div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{tenant?.company_name}</span>
            <span style={{
              marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 4,
              background: tenant?.subscription_status === 'trial'
                ? 'rgba(255,200,0,0.15)' : 'rgba(0,245,160,0.15)',
              color: tenant?.subscription_status === 'trial' ? '#ffc800' : '#00f5a0',
              fontWeight: 600,
            }}>
              {tenant?.subscription_status === 'trial' ? `Trial • ${trialDays} dias` : 'Ativo'}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent', color: '#94a3b8', cursor: 'pointer',
          fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
        }}>Sair</button>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 32, padding: 4, borderRadius: 12,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '12px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
              background: activeTab === tab.id ? 'rgba(0,245,160,0.1)' : 'transparent',
              color: activeTab === tab.id ? '#00f5a0' : '#64748b',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* PWA Tab */}
        {activeTab === 'pwa' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                Identidade Visual
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nome da Empresa</label>
                  <input value={tenant?.company_name || ''} onChange={(e) => updateField('company_name', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>URL do Logo</label>
                  <input value={tenant?.logo_url || ''} onChange={(e) => updateField('logo_url', e.target.value)} placeholder="https://..." style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Cor Principal</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="color" value={tenant?.color_primary || '#1a73e8'} onChange={(e) => updateField('color_primary', e.target.value)}
                        style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }} />
                      <input value={tenant?.color_primary || ''} onChange={(e) => updateField('color_primary', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Cor Secundária</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="color" value={tenant?.color_secondary || '#ffffff'} onChange={(e) => updateField('color_secondary', e.target.value)}
                        style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }} />
                      <input value={tenant?.color_secondary || ''} onChange={(e) => updateField('color_secondary', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                WhatsApp
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Número WhatsApp</label>
                  <input value={tenant?.whatsapp_number || ''} onChange={(e) => updateField('whatsapp_number', e.target.value)} placeholder="5511999999999" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Mensagem Padrão</label>
                  <input value={tenant?.whatsapp_message || ''} onChange={(e) => updateField('whatsapp_message', e.target.value)} placeholder="Olá, preciso de suporte" style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{
              padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                Configuração Técnica
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>URL do Servidor Traccar</label>
                  <input value={tenant?.traccar_url || ''} onChange={(e) => updateField('traccar_url', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Domínio Personalizado</label>
                  <input value={tenant?.custom_domain || ''} onChange={(e) => updateField('custom_domain', e.target.value)} placeholder="app.suaempresa.com.br" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Slug do App</label>
                  <div style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', color: '#64748b' }}>
                    {tenant?.slug}
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <p style={{
                textAlign: 'center', fontSize: 14, fontWeight: 600, margin: 0,
                color: message.includes('Erro') ? '#ff6b6b' : '#00f5a0',
              }}>{message}</p>
            )}

            <button onClick={handleSave} disabled={saving} style={{
              width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
              cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
              background: 'linear-gradient(135deg, #00f5a0, #00d9f5)', color: '#0a0a0f',
              opacity: saving ? 0.5 : 1,
            }}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        )}

        {/* Plan Tab */}
        {activeTab === 'plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: 32, borderRadius: 16, textAlign: 'center',
              background: tenant?.subscription_status === 'trial'
                ? 'linear-gradient(180deg, rgba(255,200,0,0.06) 0%, rgba(10,10,15,1) 50%)'
                : 'linear-gradient(180deg, rgba(0,245,160,0.06) 0%, rgba(10,10,15,1) 50%)',
              border: `1px solid ${tenant?.subscription_status === 'trial' ? 'rgba(255,200,0,0.2)' : 'rgba(0,245,160,0.2)'}`,
            }}>
              <div style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: 20, marginBottom: 16,
                background: tenant?.subscription_status === 'trial' ? 'rgba(255,200,0,0.1)' : 'rgba(0,245,160,0.1)',
                color: tenant?.subscription_status === 'trial' ? '#ffc800' : '#00f5a0',
                fontSize: 13, fontWeight: 700,
              }}>
                {tenant?.subscription_status === 'trial' ? '⏳ Período de Teste' : '✅ Plano Ativo'}
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
                {tenant?.plan_type === 'basic' ? 'Plano Completo' : tenant?.plan_type}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 15, margin: '0 0 24px' }}>
                R$ 24,90/mês • Todas as funcionalidades incluídas
              </p>

              {tenant?.subscription_status === 'trial' && (
                <div style={{
                  padding: 16, borderRadius: 10, background: 'rgba(255,200,0,0.05)',
                  border: '1px solid rgba(255,200,0,0.15)', marginBottom: 16,
                }}>
                  <p style={{ color: '#ffc800', fontSize: 14, fontWeight: 600, margin: 0 }}>
                    Seu trial termina em {trialDays} dias
                    ({tenant?.trial_ends_at ? new Date(tenant.trial_ends_at).toLocaleDateString('pt-BR') : ''})
                  </p>
                </div>
              )}

              <button style={{
                padding: '14px 40px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
                background: 'linear-gradient(135deg, #00f5a0, #00d9f5)', color: '#0a0a0f',
              }}>
                {tenant?.subscription_status === 'trial' ? 'Assinar Agora' : 'Gerenciar Plano'}
              </button>
            </div>

            <div style={{
              padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Detalhes da Conta</h3>
              {[
                ['Email', tenant?.owner_email],
                ['Criado em', tenant?.created_at ? new Date(tenant.created_at).toLocaleDateString('pt-BR') : '-'],
                ['Status', tenant?.subscription_status],
                ['Plano', tenant?.plan_type],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ color: '#64748b', fontSize: 14 }}>{label}</span>
                  <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Status', value: tenant?.subscription_status === 'trial' ? 'Trial' : 'Ativo', color: '#ffc800' },
                { label: 'Máx. Dispositivos', value: tenant?.max_devices || 50, color: '#00f5a0' },
                { label: 'Dias Restantes', value: trialDays, color: '#00d9f5' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: 24, borderRadius: 16, textAlign: 'center',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{
              padding: 32, borderRadius: 16, textAlign: 'center',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <p style={{ color: '#64748b', fontSize: 14 }}>
                📊 Estatísticas detalhadas estarão disponíveis em breve.
                <br />Acompanhe acessos, dispositivos ativos e mais.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
