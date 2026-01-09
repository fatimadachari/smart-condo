export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gunmetal-600">Visão Geral</h1>
                    <p className="text-gray-500">Bem-vindo ao painel de controle.</p>
                </div>
                <button className="bg-gunmetal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gunmetal-700 transition-colors">
                    Baixar Relatórios
                </button>
            </div>

            {/* Cards de Exemplo (Só para visualização) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Condomínios Ativos', value: '12', color: 'bg-terracotta-500' },
                    { label: 'Total de Moradores', value: '1,240', color: 'bg-gunmetal-600' },
                    { label: 'Tickets Abertos', value: '5', color: 'bg-orange-400' },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-lg ${card.color} opacity-10 mb-4`}></div>
                        <h3 className="text-3xl font-bold text-gunmetal-600">{card.value}</h3>
                        <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Espaço em branco para o futuro */}
            <div className="h-96 bg-white rounded-xl border border-gray-100 border-dashed flex items-center justify-center text-gray-400">
                Gráficos virão aqui...
            </div>
        </div>
    );
}