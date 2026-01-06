
import React, { useState } from 'react';
import { useApp } from '../App';
import { AlertTriangle, Plus, Clock, ShieldAlert, History } from 'lucide-react';

const OccurrencesPage: React.FC = () => {
  const { data, addOccurrence } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newOcc, setNewOcc] = useState({
    tripId: '',
    type: 'delay' as any,
    severity: 'medium' as any,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const typeTranslations: any = {
    delay: 'Atraso',
    accident: 'Acidente',
    breakdown: 'Quebra Mecânica',
    theft: 'Roubo/Furto',
    other: 'Outros'
  };

  const severityTranslations: any = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOccurrence(newOcc);
    setIsAdding(false);
    setNewOcc({
      tripId: '',
      type: 'delay',
      severity: 'medium',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Relatórios de Incidentes</h2>
          <p className="text-slate-500">Gestão e reporte de ocorrências operacionais.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium shadow-sm transition-all"
        >
          <Plus size={20} />
          {isAdding ? 'Cancelar' : 'Relatar Incidente'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Atrasos Ativos</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {data.occurrences.filter(o => o.type === 'delay').length}
            </h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Gravidade Alta</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {data.occurrences.filter(o => o.severity === 'high').length}
            </h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <History size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total de Logs</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {data.occurrences.length}
            </h4>
          </div>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Viagem</label>
              <select 
                required
                value={newOcc.tripId}
                onChange={e => setNewOcc({...newOcc, tripId: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none"
              >
                <option value="">Selecione uma viagem</option>
                {data.trips.map(t => <option key={t.id} value={t.id}>{t.origin} → {t.destination}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
              <select 
                required
                value={newOcc.type}
                onChange={e => setNewOcc({...newOcc, type: e.target.value as any})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none"
              >
                {Object.entries(typeTranslations).map(([val, label]: any) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gravidade</label>
              <select 
                required
                value={newOcc.severity}
                onChange={e => setNewOcc({...newOcc, severity: e.target.value as any})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none"
              >
                {Object.entries(severityTranslations).map(([val, label]: any) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Data</label>
              <input 
                type="date" required
                value={newOcc.date}
                onChange={e => setNewOcc({...newOcc, date: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none" 
              />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
              <textarea 
                required
                value={newOcc.description}
                onChange={e => setNewOcc({...newOcc, description: e.target.value})}
                placeholder="Descreva detalhes sobre a ocorrência..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none min-h-[100px]" 
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-rose-600 text-white font-medium hover:bg-rose-700 rounded-lg shadow-sm transition-all">Enviar Relatório</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {data.occurrences.map(occ => {
          const trip = data.trips.find(t => t.id === occ.tripId);
          return (
            <div key={occ.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-rose-200 transition-colors">
              <div className={`p-3 rounded-xl shrink-0 ${
                occ.severity === 'high' ? 'bg-rose-50 text-rose-600' : 
                occ.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
              }`}>
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900 capitalize">{typeTranslations[occ.type]}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    occ.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    Gravidade {severityTranslations[occ.severity]}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{occ.description}</p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(occ.date).toLocaleDateString('pt-BR')}</span>
                  <span className="flex items-center gap-1 border-l border-slate-200 pl-4">Viagem: {trip?.origin} para {trip?.destination}</span>
                </div>
              </div>
              <button className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all">
                Resolver
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OccurrencesPage;
