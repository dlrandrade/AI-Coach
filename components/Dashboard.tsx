
import React, { useState, useEffect } from 'react';
import { ContentPlan, User, DailyTask, WhatsAppMessage } from '../types';
import Card from './common/Card';
import Button from './common/Button';

// --- SUBCOMPONENTS ---

const PostTypeIcon: React.FC<{ type: string }> = ({ type }) => {
    const lowerType = type.toLowerCase();
    const iconClass = "h-5 w-5 text-brand-primary";
    if (lowerType.includes('reel') || lowerType.includes('video')) {
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
    }
    if (lowerType.includes('carousel')) {
      return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
};

type FeedbackStatus = 'pending' | 'done';

const DailyTaskCard: React.FC<{ task: DailyTask, onFeedback: (status: 'posted' | 'not_posted') => void; feedbackStatus: FeedbackStatus }> = ({ task, onFeedback, feedbackStatus }) => {
    return (
        <Card className="bg-white shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-brand-primary">Sua Tarefa de Hoje (via WhatsApp)</h2>
                <div className="relative group flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div className="absolute bottom-full mb-2 w-72 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-xs text-center rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Responda no WhatsApp com comandos como "outra ideia" ou "encurtar o roteiro" para que a IA ajuste a tarefa para você.
                        <svg className="absolute text-brand-dark h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-4 mb-4">
                <div className="pt-1"><PostTypeIcon type={task.postType} /></div>
                <div>
                    <h3 className="text-lg font-bold text-brand-primary">{task.topic}</h3>
                    <span className="text-sm font-semibold uppercase text-brand-secondary tracking-wider">{task.postType}</span>
                </div>
            </div>
            <div className="space-y-3 pl-10">
                 <div>
                    <h4 className="font-semibold text-gray-500 text-sm">Objetivo</h4>
                    <p className="text-gray-800">{task.objective}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500 text-sm">Roteiro / Copy</h4>
                    <p className="text-gray-800 whitespace-pre-wrap font-mono bg-brand-light p-3 rounded-md border border-gray-200">{task.scriptOrCopy}</p>
                </div>
            </div>
            <div className="mt-6 pl-10">
                {feedbackStatus === 'done' ? (
                    <div className="text-center font-semibold text-brand-accent p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        Feedback recebido! Bom trabalho.
                    </div>
                ) : (
                    <>
                        <p className="text-center font-semibold mb-3 text-sm text-gray-700">Já postou?</p>
                        <div className="flex items-center gap-4">
                            <Button onClick={() => onFeedback('posted')} variant="accent" className="!py-2">Postei</Button>
                            <Button onClick={() => onFeedback('not_posted')} variant="secondary" className="!py-2">Não Postei</Button>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};


const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-2 chat-bubble-animation">
        <div className="rounded-lg px-4 py-3 bg-white">
            <div className="flex items-center justify-center gap-1.5 typing-indicator">
                <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
            </div>
        </div>
    </div>
);


const WhatsAppLog: React.FC<{ messages: WhatsAppMessage[]; isTyping: boolean; }> = ({ messages, isTyping }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    return (
        <Card>
            <h3 className="font-bold text-lg mb-4">Log de Interação (WhatsApp)</h3>
            <div ref={scrollRef} className="space-y-4 max-h-96 overflow-y-auto p-4 bg-brand-light rounded-md border border-gray-200">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} chat-bubble-animation`}>
                        <div className={`rounded-lg px-3 py-2 max-w-sm ${msg.sender === 'luzzia' ? 'bg-white' : 'bg-emerald-200'}`}>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-xs text-gray-500 text-right mt-1">{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                {isTyping && <TypingIndicator />}
            </div>
        </Card>
    )
}

// --- MAIN COMPONENT ---

const Dashboard: React.FC<{ plan: ContentPlan; user: User; onRegenerate: () => void; }> = ({ plan, user, onRegenerate }) => {
  const [todayTask, setTodayTask] = useState<DailyTask | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('pending');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Simulate the daily task being sent via scheduler in the morning
    const task = plan.schedule.length > 0 ? plan.schedule[0] : null;
    if (task) {
        setTodayTask(task);
        setMessages([
             { id: 1, sender: 'luzzia', content: `LuzzIA se manifesta…\n\nSua tarefa para o CICLO ${task.day} está renderizada.\n\n*TÓPICO:* ${task.topic}\n*OBJETIVO:* ${task.objective}\n*FORMATO:* ${task.postType}\n\n*PROTOCOLO DE EXECUÇÃO (COPY):*\n${task.scriptOrCopy}\n\nExecute. Aguardo seu sinal.`, timestamp: '09:00 AM' },
        ]);
    }
  }, [plan.schedule]);

  const handleFeedback = (status: 'posted' | 'not_posted') => {
    setFeedbackStatus('done');
    
    const userMessageContent = status === 'posted' ? 'Postei.' : 'Não postei hoje.';
    const luzziaResponse = status === 'posted' 
        ? 'Sinal recebido. Dados computados. A frequência se mantém… por enquanto.'
        : 'Sinal recebido. Falha registrada. O protocolo será simplificado amanhã para garantir a execução. Não quebre a corrente.';

    // 1. Add user message
    setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', content: userMessageContent, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    // 2. Show typing indicator
    setIsTyping(true);

    // 3. Simulate LuzzIA's response after a delay
    setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, sender: 'luzzia', content: luzziaResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
    }, 1500);
  };


  return (
    <div className="min-h-screen bg-brand-light">
       <header className="p-4 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div className="w-8 h-8 bg-brand-dark flex items-center justify-center text-white font-bold text-sm">AI</div>
             <Button onClick={onRegenerate} variant="secondary" className="!w-auto !py-2">Refazer Diagnóstico</Button>
        </div>
    </header>
      
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-brand-primary mb-2">Dashboard de Execução</h1>
        <p className="text-brand-secondary mb-6">Olá, {user.name}. Acompanhe aqui seu plano e interação com seu coach IA.</p>

        <div className="mb-6">
            <Card className="!p-4 bg-white border-emerald-300">
                <div className="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.474.852-.352 2.054.494-.35z" /></svg>
                    <p className="text-emerald-900">
                        Conexão com WhatsApp ativa! Você receberá suas tarefas diárias no número <strong className="font-semibold">{user.whatsapp}</strong>.
                    </p>
                </div>
            </Card>
        </div>

        {todayTask && <DailyTaskCard task={todayTask} onFeedback={handleFeedback} feedbackStatus={feedbackStatus} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
                <h2 className="text-xl font-bold text-brand-primary mb-4">Resumo Estratégico</h2>
                <div className="space-y-4">
                    <Card>
                        <h3 className="font-bold text-lg mb-2">Pilares de Conteúdo</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {plan.contentPillars.map((pillar, i) => <li key={i}>{pillar}</li>)}
                        </ul>
                    </Card>
                    <Card>
                        <h3 className="font-bold text-lg mb-2">Diretrizes</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>Frequência:</strong> {plan.weeklyFrequency} posts/semana</p>
                            <p><strong>Tom de Voz:</strong> {plan.toneOfVoice}</p>
                            <p><strong>CTA Padrão:</strong> {plan.defaultCTA}</p>
                        </div>
                    </Card>
                </div>
            </section>
            <section>
                <WhatsAppLog messages={messages} isTyping={isTyping} />
            </section>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;