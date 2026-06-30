import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

/* ────────────────────────────────────────────────────────────
   Ícones inline SVG (sem dependência externa)
──────────────────────────────────────────────────────────── */
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="neu-card w-14 h-14 rounded-[16px] flex items-center justify-center mb-5 flex-shrink-0"
      style={{ color: 'var(--secondary)' }}
    >
      {children}
    </div>
  );
}

const IconOrders = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17 17l3 3 4-4" strokeWidth="2.2"/>
  </svg>
);

const IconStock = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M4 12h10M4 17h6"/><circle cx="18" cy="15" r="4"/><path d="M22 19l2 2"/>
  </svg>
);

const IconSecurity = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6l-8-4z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const IconUsers = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/>
  </svg>
);

const IconEmail = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/>
  </svg>
);

const IconFlow = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="12" r="3"/><circle cx="19" cy="12" r="3"/>
    <path d="M8 12h8M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/>
  </svg>
);

const features = [
  {
    icon: <IconOrders />,
    title: 'Fluxo de Pedidos',
    desc: '5 etapas operacionais — de Criado a Finalizado — com controle preciso de cada transição.',
  },
  {
    icon: <IconStock />,
    title: 'Estoque Inteligente',
    desc: 'Reserva automática ao separar. Visualize disponível, reservado e total em tempo real.',
  },
  {
    icon: <IconSecurity />,
    title: 'Segurança Robusta',
    desc: 'JWT via HttpOnly Cookie, SameSite Strict, rate limiting e BCrypt. Zero tokens no localStorage.',
  },
  {
    icon: <IconUsers />,
    title: 'Multi-perfil',
    desc: 'Admin, Gerente de Estoque e Vendedor — cada função vê e opera exatamente o que precisa.',
  },
];

const stats = [
  { value: '5', label: 'Etapas do fluxo de pedido' },
  { value: '3',  label: 'Perfis de acesso distintos' },
  { value: '17', label: 'Migrações de banco de dados' },
  { value: '80%+', label: 'Cobertura de testes (JaCoCo)' },
];

const statusFlow = [
  { label: 'CRIADO',     color: 'var(--tag-pend-dot)' },
  { label: 'CONFIRMADO', color: 'var(--tag-confirm-dot)' },
  { label: 'SEPARADO',   color: 'var(--tag-sep-dot)' },
  { label: 'PRONTO',     color: 'var(--tag-pronto-dot)' },
  { label: 'FINALIZADO', color: 'var(--tag-fin-dot)' },
];

/**
 * Página inicial pública do MedStorage.
 * Apresenta o sistema antes do login com hero, features e stats.
 */
export function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

      {/* ══════════ NAVBAR ══════════ */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: 'var(--bg)',
          boxShadow: '0 2px 20px var(--shadow-d)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold neu-card-sm"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}
          >
            MS
          </div>
          <span className="text-[16px] font-extrabold tracking-[-0.4px]">
            Med<em className="not-italic" style={{ color: 'var(--secondary)' }}>Storage</em>
          </span>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="neu-btn px-4 py-2 rounded-[9px] border-none cursor-pointer text-[12px] font-semibold uppercase tracking-[0.6px]"
            style={{ fontFamily: 'inherit', color: 'var(--text-muted)', background: 'var(--bg)' }}
          >
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="neu-btn px-5 py-2 rounded-[9px] border-none cursor-pointer text-[13px] font-bold"
            style={{ fontFamily: 'inherit', background: 'var(--accent)', color: 'var(--text-on-accent)' }}
          >
            Entrar
          </button>
        </div>
      </header>

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden" style={{ padding: '80px 40px 80px' }}>
        {/* Elemento decorativo de fundo */}
        <div
          className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        />

        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Texto */}
            <div>
              {/* Pill de categoria */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[1px] mb-8"
                style={{ background: 'var(--secondary-fade)', color: 'var(--secondary)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--secondary)' }} />
                Sistema de Gestão Médica
              </div>

              <h1
                className="font-display leading-[1.08] mb-6"
                style={{ fontSize: 'clamp(38px, 5vw, 62px)', letterSpacing: '-0.02em', color: 'var(--text)' }}
              >
                Distribuidora médica
                <br />
                <em className="not-italic" style={{ color: 'var(--secondary)' }}>sob controle total</em>
              </h1>

              <p
                className="text-[17px] leading-relaxed mb-10 max-w-[480px]"
                style={{ color: 'var(--text-muted)' }}
              >
                Do pedido à entrega — rastreie cada etapa, controle seu estoque com precisão e
                gerencie sua equipe num único painel.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => navigate('/login')}
                  className="neu-btn px-7 py-3.5 rounded-[12px] border-none cursor-pointer text-[15px] font-bold"
                  style={{ fontFamily: 'inherit', background: 'var(--accent)', color: 'var(--text-on-accent)' }}
                >
                  Acessar o Sistema
                </button>
                <a
                  href="#features"
                  className="text-[14px] font-semibold no-underline flex items-center gap-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Ver funcionalidades
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Visual Hero — cards flutuantes */}
            <div className="relative hidden lg:block">
              {/* Card principal */}
              <div className="neu-card rounded-[24px] p-6 mb-4">
                <p className="text-[11px] font-bold uppercase tracking-[1px] mb-4" style={{ color: 'var(--text-soft)' }}>
                  Fluxo de Status
                </p>
                <div className="flex items-center gap-1 flex-wrap">
                  {statusFlow.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-1">
                      <span
                        className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold"
                        style={{ background: `${s.color}20`, color: s.color }}
                      >
                        {s.label}
                      </span>
                      {i < statusFlow.length - 1 && (
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-soft)', flexShrink: 0 }}>
                          <path d="M2 6h8M7 3l3 3-3 3"/>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card de estoque */}
              <div className="neu-card rounded-[20px] p-5 mb-4 ml-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[13px] font-bold">Seringa 10 ml</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>SRG-10ML-001</p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-[5px] text-[10px] font-bold uppercase"
                    style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}
                  >
                    Normal
                  </span>
                </div>
                <div className="flex gap-4 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  <div>
                    <p className="font-bold text-[18px]" style={{ color: 'var(--text)' }}>340</p>
                    <p>Disponível</p>
                  </div>
                  <div>
                    <p className="font-bold text-[18px]" style={{ color: 'var(--warn)' }}>22</p>
                    <p>Reservado</p>
                  </div>
                  <div>
                    <p className="font-bold text-[18px]" style={{ color: 'var(--secondary)' }}>362</p>
                    <p>Total</p>
                  </div>
                </div>
                <div className="neu-inset h-[6px] rounded-full overflow-hidden mt-3">
                  <div className="h-full rounded-full" style={{ width: '94%', background: 'var(--ok-bar)' }} />
                </div>
              </div>

              {/* Card de notificação */}
              <div
                className="neu-card rounded-[16px] p-4 ml-2 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--secondary-fade)', color: 'var(--secondary)' }}
                >
                  <IconEmail />
                </div>
                <div>
                  <p className="text-[13px] font-bold">Pedido PRONTO</p>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
                    Notificação enviada ao cliente e à equipe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section style={{ padding: '0 40px 70px' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="neu-card rounded-[24px] p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p
                  className="font-display text-[40px] font-bold leading-none mb-2"
                  style={{ color: 'var(--accent)', letterSpacing: '-0.02em' }}
                >
                  {s.value}
                </p>
                <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" style={{ padding: '20px 40px 80px' }}>
        <div className="max-w-[1100px] mx-auto">
          {/* Título da seção */}
          <div className="text-center mb-14">
            <p
              className="text-[12px] font-bold uppercase tracking-[1.4px] mb-3"
              style={{ color: 'var(--secondary)' }}
            >
              Funcionalidades
            </p>
            <h2
              className="font-display text-[36px] leading-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Tudo que sua distribuidora precisa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(f => (
              <div
                key={f.title}
                className="neu-card rounded-[22px] p-7 flex gap-5 items-start group"
                style={{ transition: 'transform .2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <IconBox>{f.icon}</IconBox>
                <div>
                  <h3 className="text-[17px] font-bold mb-2">{f.title}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FLUXO VISUAL ══════════ */}
      <section style={{ padding: '0 40px 80px' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="neu-card rounded-[24px] p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p
                  className="text-[12px] font-bold uppercase tracking-[1.4px] mb-3"
                  style={{ color: 'var(--secondary)' }}
                >
                  Rastreabilidade Completa
                </p>
                <h2
                  className="font-display text-[32px] leading-tight mb-5"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Do pedido ao cliente,<br />sem pontos cegos
                </h2>
                <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  Reserva de estoque automática ao separar, estorno instantâneo em cancelamentos
                  e notificações por e-mail em cada etapa crítica.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: <IconFlow />, text: 'Reserva automática ao status SEPARADO' },
                    { icon: <IconEmail />, text: 'E-mail ao cliente quando pedido PRONTO' },
                    { icon: <IconStock />, text: 'Estoque atualizado somente em FINALIZADO' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--secondary-fade)', color: 'var(--secondary)' }}
                      >
                        {item.icon}
                      </span>
                      <p className="text-[13.5px]" style={{ color: 'var(--text-muted)' }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline visual */}
              <div className="flex flex-col gap-2">
                {[
                  { status: 'CRIADO',     role: 'Vendedor',        color: 'var(--tag-pend-dot)',    note: 'Pedido criado no sistema' },
                  { status: 'CONFIRMADO', role: 'Gerente',         color: 'var(--tag-confirm-dot)', note: 'Pagamento confirmado' },
                  { status: 'SEPARADO',   role: 'Gerente',         color: 'var(--tag-sep-dot)',     note: 'Itens reservados no estoque' },
                  { status: 'PRONTO',     role: 'Gerente',         color: 'var(--tag-pronto-dot)',  note: 'Cliente notificado por e-mail' },
                  { status: 'FINALIZADO', role: 'Gerente',         color: 'var(--tag-fin-dot)',     note: 'Estoque debitado, comissão gerada' },
                ].map((step, i, arr) => (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                        style={{ background: step.color }}
                      >
                        {i + 1}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-px flex-1 min-h-[20px] mt-1" style={{ background: 'var(--border)' }} />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-bold">{step.status}</span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: 'var(--secondary-fade)', color: 'var(--secondary)' }}
                        >
                          {step.role}
                        </span>
                      </div>
                      <p className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section style={{ padding: '0 40px 100px' }}>
        <div className="max-w-[1100px] mx-auto">
          <div
            className="neu-card rounded-[28px] p-12 text-center relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, var(--secondary) 0%, transparent 70%)' }}
            />
            <p
              className="text-[12px] font-bold uppercase tracking-[1.4px] mb-4"
              style={{ color: 'var(--secondary)' }}
            >
              Pronto para começar?
            </p>
            <h2
              className="font-display text-[38px] leading-tight mb-5"
              style={{ letterSpacing: '-0.02em' }}
            >
              Acesse o sistema agora
            </h2>
            <p className="text-[15px] mb-8 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
              Entre com suas credenciais e tenha controle total da sua operação de distribuição médica.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="neu-btn px-8 py-4 rounded-[14px] border-none cursor-pointer text-[16px] font-bold"
              style={{ fontFamily: 'inherit', background: 'var(--accent)', color: 'var(--text-on-accent)' }}
            >
              Entrar no Sistema
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer
        className="px-10 py-8 flex items-center justify-between flex-wrap gap-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[10px] font-extrabold"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}
          >
            MS
          </div>
          <span className="text-[14px] font-extrabold">
            Med<em className="not-italic" style={{ color: 'var(--secondary)' }}>Storage</em>
          </span>
        </div>
        <p className="text-[12px]" style={{ color: 'var(--text-soft)' }}>
          Distribuidor de Materiais Médicos &mdash; &copy; 2025 &mdash; FIAP
        </p>
        <div className="flex gap-4">
          {['Slate #394a51', 'Sage #7fa99b', 'Cream #fbf2d5', 'Amber #fdc57b'].map((c, i) => {
            const colors = ['#394a51', '#7fa99b', '#fbf2d5', '#fdc57b'];
            return (
              <div key={c} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full border"
                  style={{ background: colors[i], borderColor: 'var(--border)' }}
                />
                <span className="text-[11px]" style={{ color: 'var(--text-soft)' }}>{c}</span>
              </div>
            );
          })}
        </div>
      </footer>

    </div>
  );
}
