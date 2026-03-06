import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 97,
    yearlyPrice: 77,
    devices: 50,
    features: [
      'Rastreamento em tempo real',
      'Histórico de rotas (30 dias)',
      'Alertas de velocidade e cerca',
      'Painel personalizado com sua logo',
      'Suporte por e-mail',
    ],
  },
  {
    name: 'Professional',
    monthlyPrice: 197,
    yearlyPrice: 157,
    devices: 200,
    popular: true,
    features: [
      'Tudo do Starter +',
      'Histórico ilimitado',
      'Relatórios avançados',
      'WhatsApp integrado',
      'Domínio personalizado',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 397,
    yearlyPrice: 317,
    devices: 'Ilimitado',
    features: [
      'Tudo do Professional +',
      'API completa',
      'Multi-operador',
      'SLA garantido 99.9%',
      'Gerente de conta dedicado',
      'Integração sob medida',
    ],
  },
];

const features = [
  {
    icon: '📡',
    title: 'Rastreamento em Tempo Real',
    description: 'Monitore toda sua frota com atualizações a cada 5 segundos diretamente no mapa.',
  },
  {
    icon: '🎨',
    title: 'Marca Própria (White Label)',
    description: 'Sua logo, suas cores, seu domínio. Seus clientes nunca saberão que é HyperTraccar.',
  },
  {
    icon: '📊',
    title: 'Relatórios Completos',
    description: 'Rotas, paradas, velocidade, quilometragem e mais. Exporte para Excel ou PDF.',
  },
  {
    icon: '🔔',
    title: 'Alertas Inteligentes',
    description: 'Cercas virtuais, excesso de velocidade, ignição, bateria. Notificações em tempo real.',
  },
  {
    icon: '💬',
    title: 'WhatsApp Integrado',
    description: 'Botão de suporte via WhatsApp direto no painel para atendimento rápido.',
  },
  {
    icon: '🔒',
    title: 'Segurança Total',
    description: 'Dados criptografados, acesso por HTTPS, isolamento total entre empresas.',
  },
];

const faqs = [
  {
    q: 'Preciso ter servidor Traccar próprio?',
    a: 'Sim, cada empresa utiliza seu próprio servidor Traccar. Nós fornecemos a interface web profissional que se conecta ao seu servidor.',
  },
  {
    q: 'Posso usar meu domínio próprio?',
    a: 'Sim! No plano Professional e Enterprise você pode configurar seu domínio personalizado (ex: rastreamento.suaempresa.com.br).',
  },
  {
    q: 'Quanto tempo leva para configurar?',
    a: 'Menos de 10 minutos. Basta informar o endereço do seu servidor Traccar, enviar sua logo e definir suas cores.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim, sem multa e sem fidelidade. Cancele quando quiser pelo próprio painel.',
  },
  {
    q: 'Vocês oferecem suporte técnico?',
    a: 'Sim! Todos os planos incluem suporte. Os planos Professional e Enterprise contam com suporte prioritário.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      overflowX: 'hidden',
    }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '12px 16px',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,245,160,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16, color: '#0a0a0f',
          }}>H</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#fff', whiteSpace: 'nowrap' }}>HyperTraccar</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,245,160,0.3)',
            background: 'transparent', color: '#00f5a0', cursor: 'pointer',
            fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap',
          }}>Entrar</button>
          <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
            color: '#0a0a0f', cursor: 'pointer', fontWeight: 700, fontSize: 13,
            whiteSpace: 'nowrap', display: window.innerWidth < 480 ? 'none' : 'block',
          }}>Começar Agora</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '120px 24px 80px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,245,160,0.08) 0%, transparent 60%)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(0,245,160,0.03)', filter: 'blur(80px)',
        }} />
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: 20,
          border: '1px solid rgba(0,245,160,0.2)', background: 'rgba(0,245,160,0.05)',
          fontSize: 13, fontWeight: 600, color: '#00f5a0', marginBottom: 24, letterSpacing: 1,
        }}>
          🚀 PLATAFORMA #1 PARA EMPRESAS DE RASTREAMENTO
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900,
          lineHeight: 1.1, maxWidth: 900, margin: '0 0 24px',
          background: 'linear-gradient(135deg, #fff 30%, #00f5a0 70%, #00d9f5)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Transforme seu Traccar em um sistema profissional
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8',
          maxWidth: 640, margin: '0 0 40px', lineHeight: 1.7,
        }}>
          Interface moderna, marca própria e painel completo para sua empresa de rastreamento.
          Sem programação. Configuração em minutos.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} style={{
            padding: '16px 40px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
            color: '#0a0a0f', cursor: 'pointer', fontWeight: 800, fontSize: 16,
            boxShadow: '0 0 40px rgba(0,245,160,0.2)',
          }}>
            Começar Grátis por 7 Dias
          </button>
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{
            padding: '16px 40px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)', color: '#e2e8f0',
            cursor: 'pointer', fontWeight: 600, fontSize: 16,
          }}>
            Ver Funcionalidades
          </button>
        </div>
        <div style={{
          display: 'flex', gap: 40, marginTop: 60, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { n: '500+', l: 'Empresas ativas' },
            { n: '50K+', l: 'Veículos monitorados' },
            { n: '99.9%', l: 'Uptime garantido' },
          ].map((s) => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#00f5a0' }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: '100px 24px', maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Tudo que sua empresa precisa
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            Funcionalidades profissionais para escalar seu negócio de rastreamento
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24,
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              padding: 32, borderRadius: 16,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.3s',
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section style={{
        padding: '100px 24px', maxWidth: 900, margin: '0 auto',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0,217,245,0.04) 0%, transparent 60%)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Como funciona?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 18 }}>3 passos simples para começar</p>
        </div>
        {[
          { step: '01', title: 'Cadastre sua empresa', desc: 'Informe o endereço do seu servidor Traccar e os dados da sua empresa.' },
          { step: '02', title: 'Personalize sua marca', desc: 'Envie sua logo, defina suas cores e configure o WhatsApp de suporte.' },
          { step: '03', title: 'Pronto para usar', desc: 'Compartilhe o link com seus clientes. Eles acessam com a sua marca.' },
        ].map((s, i) => (
          <div key={s.step} style={{
            display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 48,
          }}>
            <div style={{
              minWidth: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(0,245,160,0.15), rgba(0,217,245,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 20, color: '#00f5a0',
              border: '1px solid rgba(0,245,160,0.2)',
            }}>{s.step}</div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
        padding: '100px 24px', maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Planos e Preços
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 32 }}>
            Comece grátis por 7 dias. Sem cartão de crédito.
          </p>
          <div style={{
            display: 'inline-flex', borderRadius: 12, padding: 4,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <button onClick={() => setAnnual(false)} style={{
              padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
              background: !annual ? 'rgba(0,245,160,0.15)' : 'transparent',
              color: !annual ? '#00f5a0' : '#94a3b8',
            }}>Mensal</button>
            <button onClick={() => setAnnual(true)} style={{
              padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
              background: annual ? 'rgba(0,245,160,0.15)' : 'transparent',
              color: annual ? '#00f5a0' : '#94a3b8',
            }}>
              Anual <span style={{ fontSize: 12, color: '#00f5a0', marginLeft: 4 }}>-20%</span>
            </button>
          </div>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24,
          alignItems: 'stretch',
        }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              padding: 32, borderRadius: 20, position: 'relative',
              background: plan.popular
                ? 'linear-gradient(180deg, rgba(0,245,160,0.06) 0%, rgba(10,10,15,1) 40%)'
                : 'rgba(255,255,255,0.02)',
              border: plan.popular
                ? '1px solid rgba(0,245,160,0.3)'
                : '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
                  color: '#0a0a0f', letterSpacing: 0.5,
                }}>MAIS POPULAR</div>
              )}
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{plan.name}</h3>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: '#fff' }}>
                  R${annual ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span style={{ color: '#64748b', fontSize: 15 }}>/mês</span>
              </div>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                Até {plan.devices} dispositivos
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{
                    padding: '8px 0', fontSize: 14, color: '#cbd5e1',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ color: '#00f5a0', fontSize: 16 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button style={{
                width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
                cursor: 'pointer', fontWeight: 700, fontSize: 15, transition: 'all 0.2s',
                background: plan.popular
                  ? 'linear-gradient(135deg, #00f5a0, #00d9f5)'
                  : 'rgba(255,255,255,0.06)',
                color: plan.popular ? '#0a0a0f' : '#e2e8f0',
              }}>
                Começar Teste Grátis
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: '100px 24px', maxWidth: 800, margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff',
          textAlign: 'center', marginBottom: 48,
        }}>
          Perguntas Frequentes
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            marginBottom: 12, borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)',
            background: openFaq === i ? 'rgba(255,255,255,0.03)' : 'transparent',
            overflow: 'hidden',
          }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
              width: '100%', padding: '20px 24px', border: 'none', background: 'transparent',
              color: '#fff', fontSize: 16, fontWeight: 600, textAlign: 'left', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              {faq.q}
              <span style={{
                transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s', fontSize: 20, color: '#00f5a0',
              }}>▼</span>
            </button>
            {openFaq === i && (
              <div style={{ padding: '0 24px 20px', color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 24px', textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(0,245,160,0.06) 0%, transparent 50%)',
      }}>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', marginBottom: 16,
        }}>
          Pronto para profissionalizar seu rastreamento?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Junte-se a mais de 500 empresas que já transformaram seu Traccar com o HyperTraccar.
        </p>
        <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} style={{
          padding: '18px 48px', borderRadius: 12, border: 'none',
          background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
          color: '#0a0a0f', cursor: 'pointer', fontWeight: 800, fontSize: 18,
          boxShadow: '0 0 60px rgba(0,245,160,0.2)',
        }}>
          Começar Agora — 7 Dias Grátis
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center', color: '#475569', fontSize: 14,
      }}>
        © {new Date().getFullYear()} HyperTraccar. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default LandingPage;
