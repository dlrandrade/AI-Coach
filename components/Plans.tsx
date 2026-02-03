
import React from 'react';
import Button from './common/Button';
import Card from './common/Card';

interface PlansProps {
    onPlanSelected: () => void;
}

const PlanCard: React.FC<{ title: string; price: string; description: string; onSelect: () => void; bestValue?: boolean; }> = ({ title, price, description, onSelect, bestValue }) => (
    <Card className={`text-center flex flex-col bg-white ${bestValue ? 'border-2 border-brand-primary' : ''}`}>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-3xl font-extrabold mb-1">{price}</p>
        <p className="text-brand-secondary text-sm mb-6">por mês</p>
        <p className="flex-grow text-brand-secondary mb-8">{description}</p>
        <Button onClick={onSelect} variant={bestValue ? 'primary' : 'secondary'}>
            Selecionar Plano
        </Button>
    </Card>
);


const Plans: React.FC<PlansProps> = ({ onPlanSelected }) => {
    return (
        <div className="min-h-screen bg-brand-light py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-brand-primary">Escolha seu Plano</h2>
                    <p className="mt-2 text-brand-secondary">
                        Ative seu coach de IA e comece a produzir conteúdo de forma consistente.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PlanCard 
                        title="Mensal"
                        price="R$97"
                        description="Ideal para testar o método e ver os primeiros resultados em 30 dias."
                        onSelect={onPlanSelected}
                    />
                    <PlanCard 
                        title="Semestral"
                        price="R$77"
                        description="O melhor custo-benefício para construir autoridade e consistência a médio prazo."
                        onSelect={onPlanSelected}
                        bestValue
                    />
                    <PlanCard 
                        title="Anual"
                        price="R$57"
                        description="Para quem está comprometido com o crescimento e a dominação do seu nicho."
                        onSelect={onPlanSelected}
                    />
                </div>
                <p className="text-center text-xs text-gray-400 mt-8">
                    Isso é uma simulação. Clique em qualquer plano para prosseguir.
                </p>
            </div>
        </div>
    );
}

export default Plans;
