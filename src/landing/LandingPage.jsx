import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const allFeatures = [
  'App PWA 100% com sua marca',
  'Rastreamento em tempo real',
  'Histórico de rotas ilimitado',
  'Relatórios avançados (Excel/PDF)',
  'Alertas de velocidade e cercas virtuais',
  'Botão WhatsApp personalizado',
  'Domínio próprio',
  'Multi-operador',
  'Notificações push',
  'Suporte prioritário',
];

const features = [
  {
    icon: '📱',
    title: 'App PWA Instalável',
    description: 'Seus clientes instalam direto do navegador no celular. Sem loja de apps, sem aprovação. Funciona como app nativo.',
  },
  {
    icon: '🎨',
    title: 'Sua Marca, Seu App',
    description: 'Logo, cores, domínio e WhatsApp personalizados. Seu cliente vê apenas a sua empresa — 100% white label.',
  },
  {
    icon: '🗺️',
    title: 'Mapa em Tempo Real',
    description: 'Seus clientes acompanham veículos ao vivo com ícones por categoria, status de ignição e direção.',
  },
  {
    icon: '📊',
    title: 'Relatórios para o Cliente',
    description: 'Rotas, paradas, viagens, velocidade e quilometragem. Seus clientes exportam para Excel ou PDF.',
  },
  {
    icon: '🔔',
    title: 'Alertas em Tempo Real',
    description: 'Cercas virtuais, excesso de velocidade, ignição, bateria baixa. O cliente recebe alertas instantâneos.',
  },
  {
    icon: '💬',
    title: 'WhatsApp Integrado',
    description: 'Botão flutuante no app do cliente que abre direto o WhatsApp da sua empresa. Suporte instantâneo.',
  },
];

const faqs = [
  {
    q: 'O que exatamente é o HyperTraccar?',
    a: 'É o aplicativo web (PWA) que você entrega aos seus clientes finais para eles rastrearem os veículos. Ele se conecta ao seu servidor Traccar existente e exibe os dados com a sua marca.',
  },
  {
    q: 'Preciso ter servidor Traccar?',
    a: 'Sim, você já precisa ter um servidor Traccar configurado e funcionando. O HyperTraccar é apenas o app do cliente final — não inclui servidor nem painel de gerenciamento.',
  },
  {
    q: 'O que NÃO está incluído?',
    a: 'Não vendemos servidor Traccar, não vendemos o Traccar Manager (painel administrativo). Vendemos apenas o app PWA que seus clientes usam para rastrear.',
  },
  {
    q: 'Meus clientes precisam baixar na loja?',
    a: 'Não! É um PWA — seu cliente acessa pelo link e instala direto no celular como se fosse um app. Sem Google Play, sem App Store.',
  },
  {
    q: 'Posso usar meu domínio próprio?',
    a: 'Sim! Seu app fica acessível no seu domínio (ex: app.suaempresa.com.br).',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim, sem multa e sem fidelidade. Cancele quando quiser pelo próprio painel.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const monthlyPrice = '24,90';
  const yearlyPrice = '21,90';

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
            whiteSpace: 'nowrap',
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
          📱 APP PWA WHITE LABEL PARA RASTREAMENTO
        </div>
        <h1 style={{
          fontSize: 'clamp(32px, 5.5vw, 68px)', fontWeight: 900,
          lineHeight: 1.1, maxWidth: 900, margin: '0 0 24px',
          background: 'linear-gradient(135deg, #fff 30%, #00f5a0 70%, #00d9f5)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          O app que seus clientes vão usar para rastrear
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8',
          maxWidth: 640, margin: '0 0 16px', lineHeight: 1.7,
        }}>
          Entregue um app PWA profissional com a sua marca para seus clientes finais.
          Ele se conecta ao seu Traccar e exibe tudo em tempo real.
        </p>
        <p style={{
          fontSize: 14, color: '#64748b', maxWidth: 500, margin: '0 0 40px', lineHeight: 1.6,
          fontStyle: 'italic',
        }}>
          Não vendemos servidor nem painel administrativo — apenas o app do cliente final.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/onboarding')} style={{
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
            { n: '500+', l: 'Empresas usando' },
            { n: '50K+', l: 'Clientes finais ativos' },
            { n: '99.9%', l: 'Uptime do app' },
          ].map((s) => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#00f5a0' }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What it is */}
      <section style={{
        padding: '80px 24px', maxWidth: 900, margin: '0 auto', textAlign: 'center',
      }}>
        <div style={{
          padding: 32, borderRadius: 20, background: 'rgba(0,245,160,0.03)',
          border: '1px solid rgba(0,245,160,0.1)',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            O que é o HyperTraccar?
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 16, maxWidth: 700, margin: '0 auto' }}>
            É o <strong style={{ color: '#00f5a0' }}>app final que seu cliente usa</strong> para acompanhar os veículos.
            Pense nele como o "aplicativo da sua empresa" — com sua logo, suas cores e seu domínio.
            Ele se conecta ao servidor Traccar que você já tem e exibe mapa ao vivo, histórico, alertas e relatórios.
            <br /><br />
            <strong style={{ color: '#fff' }}>Não é servidor. Não é Traccar Manager. É o app do cliente.</strong>
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: '80px 24px', maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            O que seu cliente recebe
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            Um app profissional e completo, com a cara da sua empresa
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24,
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              padding: 32, borderRadius: 16,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
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
          <p style={{ color: '#94a3b8', fontSize: 18 }}>3 passos para entregar o app aos seus clientes</p>
        </div>
        {[
          { step: '01', title: 'Conecte seu Traccar', desc: 'Informe o endereço do seu servidor Traccar. Nós nos conectamos automaticamente.' },
          { step: '02', title: 'Personalize o app', desc: 'Envie sua logo, defina suas cores e configure o WhatsApp de suporte.' },
          { step: '03', title: 'Entregue ao cliente', desc: 'Seus clientes acessam pelo link e instalam como PWA no celular. Pronto para rastrear.' },
        ].map((s) => (
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

      {/* Included vs Not Included */}
      <section style={{
        padding: '80px 24px', maxWidth: 900, margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff',
          textAlign: 'center', marginBottom: 48,
        }}>
          O que está incluído?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div style={{
            padding: 28, borderRadius: 16, background: 'rgba(0,245,160,0.04)',
            border: '1px solid rgba(0,245,160,0.15)',
          }}>
            <h3 style={{ color: '#00f5a0', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>✅ Incluído</h3>
            {[
              'App PWA com sua marca',
              'Mapa ao vivo para o cliente',
              'Histórico de rotas',
              'Relatórios (viagens, paradas, etc)',
              'Alertas e cercas virtuais',
              'Botão WhatsApp',
              'Domínio personalizado',
            ].map((item) => (
              <div key={item} style={{ padding: '6px 0', fontSize: 14, color: '#cbd5e1', display: 'flex', gap: 8 }}>
                <span style={{ color: '#00f5a0' }}>✓</span> {item}
              </div>
            ))}
          </div>
          <div style={{
            padding: 28, borderRadius: 16, background: 'rgba(255,100,100,0.03)',
            border: '1px solid rgba(255,100,100,0.1)',
          }}>
            <h3 style={{ color: '#ff6b6b', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>❌ Não incluído</h3>
            {[
              'Servidor Traccar',
              'Traccar Manager (admin)',
              'Chips / SIM cards',
              'Rastreadores / equipamentos',
              'Instalação de GPS',
              'Suporte ao servidor',
            ].map((item) => (
              <div key={item} style={{ padding: '6px 0', fontSize: 14, color: '#94a3b8', display: 'flex', gap: 8 }}>
                <span style={{ color: '#ff6b6b' }}>✗</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Single Plan */}
      <section id="pricing" style={{
        padding: '100px 24px', maxWidth: 600, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Preço Simples
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 32 }}>
            Tudo incluso. Sem limites. Comece grátis por 7 dias.
          </p>
          <div style={{
            display: 'inline-flex', borderRadius: 12, padding: 4,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <button onClick={() => setAnnual(false)} style={{
              padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
              background: !annual ? 'rgba(0,245,160,0.15)' : 'transparent',
              color: !annual ? '#00f5a0' : '#94a3b8',
            }}>Mensal</button>
            <button onClick={() => setAnnual(true)} style={{
              padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
              background: annual ? 'rgba(0,245,160,0.15)' : 'transparent',
              color: annual ? '#00f5a0' : '#94a3b8',
            }}>
              Anual <span style={{ fontSize: 12, color: '#00f5a0', marginLeft: 4 }}>-12%</span>
            </button>
          </div>
        </div>

        <div style={{
          padding: 40, borderRadius: 20,
          background: 'linear-gradient(180deg, rgba(0,245,160,0.06) 0%, rgba(10,10,15,1) 40%)',
          border: '1px solid rgba(0,245,160,0.3)',
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 56, fontWeight: 900, color: '#fff' }}>
              R${annual ? yearlyPrice : monthlyPrice}
            </span>
            <span style={{ color: '#64748b', fontSize: 16 }}>/mês</span>
          </div>
          {annual && (
            <p style={{ color: '#00f5a0', fontSize: 13, marginBottom: 24 }}>
              Economia de 12% no plano anual
            </p>
          )}
          {!annual && <div style={{ marginBottom: 24 }} />}
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', textAlign: 'left' }}>
            {allFeatures.map((f) => (
              <li key={f} style={{
                padding: '10px 0', fontSize: 15, color: '#cbd5e1',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ color: '#00f5a0', fontSize: 16 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate('/onboarding')} style={{
            width: '100%', padding: '16px 0', borderRadius: 12, border: 'none',
            cursor: 'pointer', fontWeight: 700, fontSize: 16,
            background: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
            color: '#0a0a0f',
            boxShadow: '0 0 40px rgba(0,245,160,0.15)',
          }}>
            Começar Teste Grátis — 7 Dias
          </button>
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
          Entregue um app profissional aos seus clientes
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 40, maxWidth: 550, margin: '0 auto 40px' }}>
          Configure em minutos, com sua marca. Seus clientes instalam no celular e rastreiam ao vivo.
        </p>
        <button onClick={() => navigate('/onboarding')} style={{
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
