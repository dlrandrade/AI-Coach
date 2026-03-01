import React, { useState } from 'react';

type Props = {
  onStart: () => void;
};

const logos = ['Nexa', 'Orbit', 'Vanta', 'LinearX', 'ScaleCo'];

const comparisons = [
  { left: 'Diagnóstico subjetivo', right: 'Sentença estratégica orientada por método' },
  { left: 'Postagem sem direção', right: 'Plano de 7/30 dias com prompts executáveis' },
  { left: 'Ajustes lentos e manuais', right: 'Correção rápida com prioridade de alavancagem' },
  { left: 'Sem critério de prova', right: 'Dissecção objetiva de bio/feed/stories/provas/ofertas' }
];

const bento = [
  {
    title: 'Objetivo único por diagnóstico',
    desc: 'Sem dispersão: cada análise é orientada para um objetivo primário.',
    ui: 'selector'
  },
  {
    title: 'Prompt completo com contexto',
    desc: 'Copiou, executou. O prompt já carrega o contexto do diagnóstico.',
    ui: 'prompt'
  },
  {
    title: 'Lead unlock integrado',
    desc: 'Você captura lead e só então libera o plano completo.',
    ui: 'lead'
  },
  {
    title: 'Sinais de confiança em runtime',
    desc: 'Status, origem de modelo e indicador de unicidade do plano.',
    ui: 'status'
  }
];

const testimonials = [
  {
    text: 'Em uma semana saímos de conteúdo genérico para narrativa com direção clara e mais conversas qualificadas.',
    name: 'Larissa Moura',
    role: 'Head de Marketing'
  },
  {
    text: 'O diagnóstico mostrou exatamente onde meu perfil sabotava minha oferta. O plano virou execução diária.',
    name: 'Rafael Teixeira',
    role: 'Founder'
  },
  {
    text: 'A maior diferença foi a clareza: o que manter, o que cortar e como posicionar com prova.',
    name: 'Camila Reis',
    role: 'Especialista em Vendas'
  }
];

const faqs = [
  {
    q: 'Preciso de cartão para começar?',
    a: 'Não. Você consegue iniciar o diagnóstico sem cartão e só desbloqueia o plano completo após o lead unlock.'
  },
  {
    q: 'Serve para qualquer nicho?',
    a: 'Funciona melhor para quem já publica conteúdo e precisa transformar presença em posicionamento e conversão.'
  },
  {
    q: 'Quanto tempo leva para aplicar?',
    a: 'Você pode começar no mesmo dia. O plano vem estruturado por dia com prompts prontos para execução.'
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim. Não há lock-in operacional para aplicar o plano no seu fluxo.'
  },
  {
    q: 'Como funciona segurança dos dados?',
    a: 'Dados sensíveis não ficam hardcoded no frontend. O fluxo usa endpoints e variáveis de ambiente no backend.'
  }
];

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="container-neurelic min-h-[90vh] flex items-center py-10 md:py-16 reveal">
        <div className="w-full grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <span className="tech-label">AI-COACH • DIAGNÓSTICO DE DOMÍNIO</span>
            <h1 className="hero-title leading-tight">
              Seu Instagram está
              <br />
              <span>construindo autoridade</span>
              <br />
              ou só gerando ruído?
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed max-w-xl">
              Diagnóstico estratégico para identificar gargalos de posicionamento e entregar um plano de execução de 7 ou 30 dias com prompts prontos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onStart} className="btn-neurelic min-h-[56px] px-8">
                TESTAR GRÁTIS
              </button>
              <a href="#comparacao" className="btn-outline min-h-[56px] px-8 text-center">
                VER COMPARAÇÃO
              </a>
            </div>
            <p className="text-xs text-gray-500">Sem cartão de crédito para começar.</p>
          </div>

          {/* Mockup funcional em código */}
          <div className="card-tech bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
            <div className="border-2 border-black bg-white">
              <div className="p-3 border-b-2 border-black flex items-center justify-between">
                <span className="micro-label">PAINEL DE DIAGNÓSTICO</span>
                <span className="text-[10px] font-mono bg-black text-white px-2 py-1">AO VIVO</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Posicionamento atual</span>
                  <span className="font-bold text-amber-600">ASPIRANTE</span>
                </div>
                <div className="h-2 bg-gray-200">
                  <div className="h-2 bg-green-600 w-[64%] transition-all duration-500" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="border-2 p-2">BIO: ALAVANCA</div>
                  <div className="border-2 p-2">FEED: SABOTADOR</div>
                  <div className="border-2 p-2">PROVAS: SABOTADOR</div>
                  <div className="border-2 p-2">OFERTA: NEUTRO</div>
                </div>
                <div className="border-2 bg-gray-50 p-3 text-xs font-mono">
                  Ação principal: publicar case com contexto + métrica + CTA.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="container-neurelic py-8 md:py-12 reveal">
        <p className="micro-label mb-4">USADO POR TIMES INOVADORES EM:</p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 opacity-60 grayscale">
          {logos.map((l) => (
            <div key={l} className="border-2 border-gray-300 py-3 text-center font-semibold text-sm bg-white">{l}</div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3 text-sm">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
            ))}
          </div>
          <span className="font-semibold">★★★★★</span>
          <span className="text-gray-600">avaliado por especialistas e founders</span>
        </div>
      </section>

      {/* COMPARAÇÃO */}
      <section id="comparacao" className="container-neurelic py-10 md:py-14 reveal">
        <h2 className="section-title mb-6">Ferramentas tradicionais vs AI-Coach</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-tech border-red-300 bg-red-50/30">
            <h3 className="font-extrabold mb-3">Ferramentas tradicionais</h3>
            <ul className="space-y-2 text-sm">
              {comparisons.map((c, i) => (
                <li key={i} className="flex gap-2"><span className="text-red-600">✕</span><span>{c.left}</span></li>
              ))}
            </ul>
          </div>
          <div className="card-tech border-green-500 bg-green-50/30">
            <h3 className="font-extrabold mb-3">AI-Coach</h3>
            <ul className="space-y-2 text-sm">
              {comparisons.map((c, i) => (
                <li key={i} className="flex gap-2"><span className="text-green-600">✓</span><span>{c.right}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BENTO */}
      <section className="container-neurelic py-10 md:py-14 reveal">
        <h2 className="section-title mb-6">Benefícios em execução</h2>
        <div className="grid md:grid-cols-6 gap-4">
          {bento.map((f, idx) => (
            <div key={f.title} className={`card-tech ${idx === 0 || idx === 3 ? 'md:col-span-3' : 'md:col-span-3'} space-y-3`}>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-gray-700">{f.desc}</p>
              {f.ui === 'selector' && (
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 border-2 border-black bg-black text-white">AUTORIDADE</span>
                  <span className="px-2 py-1 border-2 border-black">STATUS</span>
                </div>
              )}
              {f.ui === 'prompt' && (
                <div className="text-xs font-mono border-2 p-2 bg-gray-50">CONTEXTO FIXO + TAREFA DO DIA</div>
              )}
              {f.ui === 'lead' && (
                <button className="btn-outline h-10 text-xs">DESBLOQUEAR PLANO</button>
              )}
              {f.ui === 'status' && (
                <div className="inline-flex items-center gap-2 text-xs font-mono bg-black text-white px-2 py-1 rounded-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> ok • uniq:100%
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-neurelic py-10 md:py-14 reveal">
        <h2 className="section-title mb-6">Quem aplicou, sentiu diferença</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="card-tech space-y-3">
              <p className="text-sm leading-relaxed">“{t.text}”</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-black" />
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-gray-600">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-neurelic py-10 md:py-14 reveal">
        <h2 className="section-title mb-6">FAQ</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className="border-2 border-black">
                <button
                  className="w-full text-left px-4 py-3 flex justify-between items-center font-semibold"
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span>{f.q}</span>
                  <span>{open ? '−' : '+'}</span>
                </button>
                {open && <div className="px-4 pb-4 text-sm text-gray-700">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL + FOOTER */}
      <section className="container-neurelic py-14 md:py-16 text-center reveal">
        <h2 className="section-title mb-4">Pronto para transformar seu posicionamento?</h2>
        <p className="text-gray-700 mb-6">Comece agora e receba uma direção prática para os próximos dias.</p>
        <button onClick={onStart} className="btn-neurelic min-h-[56px] px-10">COMEÇAR AGORA</button>

        <footer className="mt-12 pt-6 border-t-2 border-black text-xs text-gray-600 flex flex-col md:flex-row items-center justify-center gap-4">
          <a href="#" className="hover:text-black">Termos</a>
          <a href="#" className="hover:text-black">Privacidade</a>
          <a href="https://instagram.com/danielluzz" target="_blank" rel="noreferrer" className="hover:text-black">Instagram</a>
        </footer>
      </section>
    </div>
  );
};
