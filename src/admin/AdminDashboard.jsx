import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useTranslation } from '../common/components/LocalizationProvider';

const AdminDashboard = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('pwa');
  const [message, setMessage] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setMessage(t('adminSavedSuccess'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`${t('adminErrorSave')}: ` + err.message);
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage(t('adminErrorFileSize'));
      return;
    }
    setUploadingLogo(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${tenant.id}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(path);
      updateField('logo_url', publicUrl);
      setMessage(t('adminLogoSuccess'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`${t('adminErrorLogo')}: ` + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const getPwaLink = () => {
    if (tenant?.custom_domain) return `https://${tenant.custom_domain}`;
    return `${window.location.origin}/login?tenant=${tenant?.slug}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPwaLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <p style={{ color: '#64748b', fontSize: 14 }}>{t('adminLoadingPanel')}</p>
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
    display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  const cardStyle = {
    padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const trialDays = tenant?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const tabs = [
    { id: 'pwa', label: `🎨 ${t('adminCustomize')}` },
    { id: 'link', label: `🔗 ${t('adminAppLink')}` },
    { id: 'plan', label: `📋 ${t('adminPlan')}` },
    { id: 'stats', label: `📊 ${t('adminStatistics')}` },
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
          {tenant?.logo_url ? (
            <img src={tenant.logo_url} alt="Logo" style={{
              width: 32, height: 32, borderRadius: 8, objectFit: 'contain',
            }} />
          ) : (
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 14, color: '#0a0a0f',
            }}>H</div>
          )}
          <div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{tenant?.company_name}</span>
            <span style={{
              marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 4,
              background: tenant?.subscription_status === 'trial'
                ? 'rgba(255,200,0,0.15)' : 'rgba(0,245,160,0.15)',
              color: tenant?.subscription_status === 'trial' ? '#ffc800' : '#00f5a0',
              fontWeight: 600,
            }}>
              {tenant?.subscription_status === 'trial' ? `Trial • ${trialDays} dias` : t('adminPlanActive')}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent', color: '#94a3b8', cursor: 'pointer',
          fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
        }}>{t('adminLogout')}</button>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 32, padding: 4, borderRadius: 12,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          overflowX: 'auto',
        }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '12px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13, fontFamily: 'inherit', whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'rgba(0,245,160,0.1)' : 'transparent',
              color: activeTab === tab.id ? '#00f5a0' : '#64748b',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* PWA Tab */}
        {activeTab === 'pwa' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Logo & Identity */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                {t('adminVisualIdentity')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t('adminCompanyName')}</label>
                  <input value={tenant?.company_name || ''} onChange={(e) => updateField('company_name', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t('adminCompanyLogo')}</label>
                  {tenant?.logo_url && (
                    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={tenant.logo_url} alt="Logo" style={{
                        maxWidth: 120, maxHeight: 60, width: 'auto', height: 'auto',
                        borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                        objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: 4,
                      }} />
                      <button onClick={() => updateField('logo_url', '')} style={{
                        padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,100,100,0.3)',
                        background: 'rgba(255,100,100,0.1)', color: '#ff6b6b', cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                      }}>Remover</button>
                    </div>
                  )}
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
                    border: '2px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)',
                    color: '#94a3b8', fontSize: 13, fontWeight: 600,
                  }}>
                    <span>{uploadingLogo ? t('adminUploading') : `📁 ${t('adminUploadLogo')}`}</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingLogo} onChange={handleLogoUpload} />
                  </label>
                  <p style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>{t('adminFileMaxSize')}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>{t('adminPrimaryColor')}</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="color" value={tenant?.color_primary || '#1a73e8'} onChange={(e) => updateField('color_primary', e.target.value)}
                        style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }} />
                      <input value={tenant?.color_primary || ''} onChange={(e) => updateField('color_primary', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>{t('adminSecondaryColor')}</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="color" value={tenant?.color_secondary || '#ffffff'} onChange={(e) => updateField('color_secondary', e.target.value)}
                        style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }} />
                      <input value={tenant?.color_secondary || ''} onChange={(e) => updateField('color_secondary', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>WhatsApp</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t('adminWhatsappNumber')}</label>
                  <input value={tenant?.whatsapp_number || ''} onChange={(e) => updateField('whatsapp_number', e.target.value)} placeholder="5511999999999" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t('adminDefaultMessage')}</label>
                  <input value={tenant?.whatsapp_message || ''} onChange={(e) => updateField('whatsapp_message', e.target.value)} placeholder="Olá, preciso de suporte" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Technical Config */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>{t('adminTechnicalConfig')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t('adminTraccarUrl')}</label>
                  <input value={tenant?.traccar_url || ''} onChange={(e) => updateField('traccar_url', e.target.value)} placeholder="https://seuservidor.com" style={inputStyle} />
                  <p style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
                    URL do seu servidor Traccar (ex: https://demo.traccar.org)
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>{t('adminCustomDomain')}</label>
                  <input value={tenant?.custom_domain || ''} onChange={(e) => updateField('custom_domain', e.target.value)} placeholder="app.suaempresa.com.br" style={inputStyle} />
                  <p style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
                    Opcional: configure um domínio próprio para seu app
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <p style={{
                textAlign: 'center', fontSize: 14, fontWeight: 600, margin: 0,
                color: message.includes('Erro') || message.includes('Error') ? '#ff6b6b' : '#00f5a0',
              }}>{message}</p>
            )}

            <button onClick={handleSave} disabled={saving} style={{
              width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
              cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
              background: 'linear-gradient(135deg, #00f5a0, #00d9f5)', color: '#0a0a0f',
              opacity: saving ? 0.5 : 1,
            }}>
              {saving ? t('adminSaving') : t('adminSaveChanges')}
            </button>
          </div>
        )}

        {/* Link Tab */}
        {activeTab === 'link' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: 32, borderRadius: 16, textAlign: 'center',
              background: 'linear-gradient(180deg, rgba(0,245,160,0.06) 0%, rgba(10,10,15,1) 50%)',
              border: '1px solid rgba(0,245,160,0.2)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
                {t('adminYourAppLink')}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 24px' }}>
                {t('adminShareLink')}
              </p>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10, padding: '12px 16px', marginBottom: 16,
              }}>
                <span style={{
                  flex: 1, color: '#00f5a0', fontSize: 14, fontWeight: 600,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  textAlign: 'left',
                }}>
                  {getPwaLink()}
                </span>
                <button onClick={handleCopyLink} style={{
                  padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
                  background: copied ? '#00f5a0' : 'rgba(0,245,160,0.15)',
                  color: copied ? '#0a0a0f' : '#00f5a0',
                  transition: 'all 0.2s',
                }}>
                  {copied ? t('adminCopied') : t('adminCopy')}
                </button>
              </div>

              <div style={{
                display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
              }}>
                <a
                  href={getPwaLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 24px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                    background: 'transparent', color: '#e2e8f0', cursor: 'pointer',
                    fontWeight: 600, fontSize: 13, textDecoration: 'none',
                  }}
                >
                  {t('adminOpenApp')} ↗
                </a>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
                {t('adminHowItWorks')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { step: '1', title: t('adminStep1Title'), desc: t('adminStep1Desc') },
                  { step: '2', title: t('adminStep2Title'), desc: t('adminStep2Desc') },
                  { step: '3', title: t('adminStep3Title'), desc: t('adminStep3Desc') },
                ].map((item) => (
                  <div key={item.step} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(0,245,160,0.1)', color: '#00f5a0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 13,
                    }}>{item.step}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{item.title}</div>
                      <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
                {t('adminAppInfo')}
              </h3>
              {[
                ['Slug', tenant?.slug],
                [t('adminCustomDomain'), tenant?.custom_domain || t('adminCustomDomainNotSet')],
                [t('adminTraccarUrl'), tenant?.traccar_url || t('adminCustomDomainNotSet')],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ color: '#64748b', fontSize: 14 }}>{label}</span>
                  <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>
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
                {tenant?.subscription_status === 'trial' ? `⏳ ${t('adminTrialPeriod')}` : `✅ ${t('adminPlanActive')}`}
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
                Plano Completo
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 15, margin: '0 0 24px' }}>
                R$ 24,90/mês • Todas as funcionalidades
              </p>
              {tenant?.subscription_status === 'trial' && (
                <div style={{
                  padding: 16, borderRadius: 10, background: 'rgba(255,200,0,0.05)',
                  border: '1px solid rgba(255,200,0,0.15)', marginBottom: 16,
                }}>
                  <p style={{ color: '#ffc800', fontSize: 14, fontWeight: 600, margin: 0 }}>
                    {t('adminTrialEndsIn').replace('{0}', trialDays)}
                    ({tenant?.trial_ends_at ? new Date(tenant.trial_ends_at).toLocaleDateString('pt-BR') : ''})
                  </p>
                </div>
              )}
              <button style={{
                padding: '14px 40px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
                background: 'linear-gradient(135deg, #00f5a0, #00d9f5)', color: '#0a0a0f',
              }}>
                {tenant?.subscription_status === 'trial' ? t('adminSubscribeNow') : t('adminManagePlan')}
              </button>
            </div>

            <div style={cardStyle}>
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
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
