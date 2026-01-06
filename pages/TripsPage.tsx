
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { TripStatus } from '../types';
import { Plus, Calendar, Scale, ChevronRight, Calculator, MapPin, Truck as TruckIcon } from 'lucide-react';

const TripsPage: React.FC = () => {
  const { data, addTrip } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newTrip, setNewTrip] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
    status: TripStatus.PLANNED,
    driverId: '',
    vehicleId: '',
    clientId: '',
    cargoWeight: 0,
    valuePerTon: 0,
    revenue: 0,
    distanceKm: 0
  });

  useEffect(() => {
    const tons = (newTrip.cargoWeight || 0) / 1000;
    const calculatedRevenue = tons * (newTrip.valuePerTon || 0);
    setNewTrip(prev => ({ ...prev, revenue: calculatedRevenue }));
  }, [newTrip.cargoWeight, newTrip.valuePerTon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrip(newTrip);
    setIsAdding(false);
    setNewTrip({
      origin: '',
      destination: '',
      departureDate: '',
      arrivalDate: '',
      status: TripStatus.PLANNED,
      driverId: '',
      vehicleId: '',
      clientId: '',
      cargoWeight: 0,
      valuePerTon: 0,
      revenue: 0,
      distanceKm: 0
    });
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Viagens de Frete</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium">Controle de fluxo de mercadorias.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all w-full md:w-auto
            ${isAdding ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'}`}
        >
          {isAdding ? <Plus className="rotate-45" size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancelar' : 'Nova Viagem'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FormInput label="Origem" placeholder="Sair de..." value={newTrip.origin} onChange={(v:any) => setNewTrip({...newTrip, origin: v})} />
            <FormInput label="Destino" placeholder="Entregar em..." value={newTrip.destination} onChange={(v:any) => setNewTrip({...newTrip, destination: v})} />
            <FormInput label="Partida" type="date" value={newTrip.departureDate} onChange={(v:any) => setNewTrip({...newTrip, departureDate: v})} />
            
            <FormSelect label="Motorista" value={newTrip.driverId} onChange={(v:any) => setNewTrip({...newTrip, driverId: v})}>
                <option value="">Selecione...</option>
                {data.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </FormSelect>
            <FormSelect label="Veículo" value={newTrip.vehicleId} onChange={(v:any) => setNewTrip({...newTrip, vehicleId: v})}>
                <option value="">Selecione...</option>
                {data.vehicles.map(v => <option key={v.id} value={v.id}>{v.plate}</option>)}
            </FormSelect>
            <FormSelect label="Cliente" value={newTrip.clientId} onChange={(v:any) => setNewTrip({...newTrip, clientId: v})}>
                <option value="">Selecione...</option>
                {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </FormSelect>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Peso (kg)</label>
              <input type="number" required value={newTrip.cargoWeight || ''} onChange={e => setNewTrip({...newTrip, cargoWeight: Number(e.target.value)})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valor/Ton (R$)</label>
              <input type="number" required value={newTrip.valuePerTon || ''} onChange={e => setNewTrip({...newTrip, valuePerTon: Number(e.target.value)})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black" />
            </div>
            <div className="p-4 bg-blue-600 rounded-xl text-white flex justify-between items-center">
              <span className="text-[10px] font-black uppercase">Receita Est.</span>
              <span className="text-xl font-black">R$ {newTrip.revenue.toLocaleString()}</span>
            </div>
          </div>
          <button type="submit" className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Confirmar Viagem</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.trips.map(trip => {
          const driver = data.drivers.find(d => d.id === trip.driverId);
          return (
            <div key={trip.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${trip.status === TripStatus.DELIVERED ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {trip.status}
                </span>
                <span className="text-[9px] text-slate-400 font-black tracking-widest">ID {trip.id.slice(0,6)}</span>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center py-1 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                    <div className="w-2 h-2 rounded-full border-2 border-emerald-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Origem</p>
                    <p className="font-bold text-sm truncate">{trip.origin}</p>
                    <div className="h-4"></div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Destino</p>
                    <p className="font-bold text-sm truncate">{trip.destination}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden">
                       <img src={`https://picsum.photos/seed/${trip.driverId}/40/40`} alt="M" />
                    </div>
                    <span className="text-xs font-black truncate max-w-[80px]">{driver?.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Faturamento</p>
                    <p className="text-base font-black text-slate-900">R$ {trip.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FormInput = ({ label, type = 'text', value, onChange, placeholder }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    <input type={type} required value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10" />
  </div>
);

const FormSelect = ({ label, value, onChange, children }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    <select required value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">{children}</select>
  </div>
);

export default TripsPage;
