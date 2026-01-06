
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { Plus, DollarSign, Filter, Download, ArrowUpRight } from 'lucide-react';

const CostsPage: React.FC = () => {
  const { data, addCost } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newCost, setNewCost] = useState({
    tripId: '',
    category: 'fuel' as any,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const categoryTranslations: any = {
    fuel: 'Combustível',
    maintenance: 'Manutenção',
    toll: 'Pedágio',
    salary: 'Salário',
    other: 'Outros'
  };

  const categoryTotals = useMemo(() => {
    return data.costs.reduce((acc: any, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
  }, [data.costs]);

  const totalCost = data.costs.reduce((acc, c) => acc + c.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCost(newCost);
    setIsAdding(false);
    setNewCost({
      tripId: '',
      category: 'fuel',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Custos Operacionais</h2>
          <p className="text-slate-500">Gestão de gastos com combustível, manutenção e taxas.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} /> Exportar
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus size={20} />
            {isAdding ? 'Cancelar' : 'Lançar Gasto'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Gasto Total</p>
            <h4 className="text-2xl font-bold text-slate-900">R$ {totalCost.toLocaleString('pt-BR')}</h4>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <DollarSign className="text-slate-400" size={24} />
          </div>
        </div>
        {Object.entries(categoryTotals).map(([cat, total]: any) => (
          <div key={cat} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1 capitalize">{categoryTranslations[cat]}</p>
              <h4 className="text-2xl font-bold text-slate-900">R$ {total.toLocaleString('pt-BR')}</h4>
            </div>
            <div className={`p-3 rounded-lg ${cat === 'fuel' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
              <ArrowUpRight size={20} />
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-in fade-in zoom-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Viagem Relacionada</label>
              <select 
                required
                value={newCost.tripId}
                onChange={e => setNewCost({...newCost, tripId: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="">Selecione uma viagem</option>
                {data.trips.map(t => <option key={t.id} value={t.id}>{t.origin} → {t.destination}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
              <select 
                required
                value={newCost.category}
                onChange={e => setNewCost({...newCost, category: e.target.value as any})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                {Object.entries(categoryTranslations).map(([val, label]: any) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Valor (R$)</label>
              <input 
                type="number" step="0.01" required
                value={newCost.amount || ''}
                onChange={e => setNewCost({...newCost, amount: e.target.value === '' ? 0 : Number(e.target.value)})}
                placeholder="0,00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-lg font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Data</label>
              <input 
                type="date" required
                value={newCost.date}
                onChange={e => setNewCost({...newCost, date: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500/20 outline-none" 
              />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
              <input 
                type="text" required
                value={newCost.description}
                onChange={e => setNewCost({...newCost, description: e.target.value})}
                placeholder="Ex: Pedágio BR-163 Km 450..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500/20 outline-none" 
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg shadow-sm transition-all">Registrar Gasto</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Lançamentos Recentes</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select className="pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none">
                <option>Todas Categorias</option>
                <option>Combustível</option>
                <option>Pedágio</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Viagem</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.costs.map((cost) => {
                const trip = data.trips.find(t => t.id === cost.tripId);
                return (
                  <tr key={cost.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{new Date(cost.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-2 py-0.5 rounded text-[10px] font-bold uppercase
                        ${cost.category === 'fuel' ? 'bg-amber-100 text-amber-700' : 
                          cost.category === 'maintenance' ? 'bg-indigo-100 text-indigo-700' : 
                          'bg-slate-100 text-slate-700'}
                      `}>
                        {categoryTranslations[cost.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {trip ? `${trip.origin} → ${trip.destination}` : 'Avulso'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{cost.description}</td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-rose-600">
                      - R$ {cost.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostsPage;
