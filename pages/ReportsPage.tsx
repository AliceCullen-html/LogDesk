
import React from 'react';
import { 
  FileText, 
  Download, 
  ChevronRight, 
  BarChart2, 
  PieChart as PieIcon, 
  Table as TableIcon 
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const reports = [
    { title: 'Eficiência de Frota', desc: 'Detalhamento de utilização de veículos e tempo de inatividade em manutenção.', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'DRE Financeiro', desc: 'Resumo de Receita vs Custos Operacionais (combustível, pedágios, salários).', icon: PieIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Análise de Incidentes', desc: 'Frequência de ocorrências e análise de impacto por rota.', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Scorecard de Motoristas', desc: 'Métricas de desempenho para cada motorista registrado.', icon: TableIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Relatórios Avançados</h2>
        <p className="text-slate-500">Analise seus dados de longo prazo para decisões estratégicas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-xl shrink-0 ${report.bg} ${report.color}`}>
                <report.icon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{report.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{report.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-all">
                      <Download size={14} /> PDF
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-xs font-bold hover:bg-slate-200 transition-all">
                      <Download size={14} /> CSV
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                    Ver Interativo <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Relatórios Gerados Recentemente</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Operacoes_Mensais_Fev_2024.pdf', date: '28 de Fev, 2024', size: '2.4 MB' },
            { name: 'Resumo_Financeiro_Anual_2023.csv', date: '15 de Jan, 2024', size: '1.1 MB' },
            { name: 'Eficiencia_Motoristas_Q4.xlsx', date: '05 de Jan, 2024', size: '840 KB' },
          ].map(file => (
            <div key={file.name} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 text-slate-400 rounded">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-400">{file.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs font-medium text-slate-400">{file.size}</span>
                <Download size={18} className="text-slate-300 hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
