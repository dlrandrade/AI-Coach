
import React from 'react';
import Button from './common/Button';

interface AnalysisReportProps {
  report: string;
  instagramHandle: string;
  onContinue: () => void;
}

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    return (
        <>
            {lines.map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3">{line.replace(/\*\*/g, '')}</h2>;
                }
                if (line.startsWith('* ')) {
                     return <li key={index} className="list-disc list-inside mb-2">{line.substring(2)}</li>
                }
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                return <p key={index} className="mb-4">{line}</p>;
            })}
        </>
    );
};


const AnalysisReport: React.FC<AnalysisReportProps> = ({ report, instagramHandle, onContinue }) => {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-light py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Análise Concluída</p>
                <h1 className="text-4xl font-bold text-white mt-2">Diagnóstico para @{instagramHandle}</h1>
            </div>

            <div className="bg-brand-primary/50 border border-brand-secondary p-8 md:p-12 text-gray-300 leading-relaxed">
                 <SimpleMarkdown text={report} />
            </div>
            
            <div className="mt-10 text-center">
                <Button 
                    onClick={onContinue} 
                    variant="accent" 
                    className="!w-auto px-10 !py-4"
                >
                    Ver meu plano de execução
                </Button>
            </div>
        </div>
    </div>
  );
};

export default AnalysisReport;
