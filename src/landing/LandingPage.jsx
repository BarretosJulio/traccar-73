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
