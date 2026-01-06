
import React, { useState } from 'react';
import { useApp } from '../App';
import { Users, Truck, Building2, Plus, Mail, Phone, Hash } from 'lucide-react';

const RegistrationsPage: React.FC = () => {
  const { data, addDriver, addVehicle, addClient } = useApp();
  const [activeTab, setActiveTab] = useState<'drivers' | 'vehicles' | 'clients'>('drivers');
  const [isAdding, setIsAdding] = useState(false);

  // Forms
  const [driverForm, setDriverForm] = useState({ name: '', license: '', phone: '', status: 'active' as any });
  const [vehicleForm, setVehicleForm] = useState({ model: '', plate: '', capacity: 0, status: 'available' as any });
  const [clientForm, setClientForm] = useState({ name: '', email: '', address: '' });

  const tabLabels: any = {
    drivers: 'Motoristas',
    vehicles: 'Veículos',
    clients: 'Clientes'
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'drivers') addDriver(driverForm);
    else if (activeTab === 'vehicles') addVehicle(vehicleForm);
    else if (activeTab === 'clients') addClient(clientForm);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cadastros de Base</h2>
          <p className="text-slate-500">Gerencie sua frota, equipe e parceiros comerciais.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-sm transition-all"
        >
          <Plus size={20} />
          {isAdding ? 'Cancelar' : `Adicionar ${tabLabels[activeTab].slice(0, -1)}`}
        </button>
      </div>

      <div className="flex border-b border-slate-200">
        {[
          { id: 'drivers', label: 'Motoristas', icon: Users },
          { id: 'vehicles', label: 'Veículos', icon: Truck },
          { id: 'clients', label: 'Clientes', icon: Building2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setIsAdding(false); }}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2
              ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'drivers' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
                  <input required value={driverForm.name} onChange={e => setDriverForm({...driverForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Número da CNH</label>
                  <input required value={driverForm.license} onChange={e => setDriverForm({...driverForm, license: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Telefone</label>
                  <input required value={driverForm.phone} onChange={e => setDriverForm({...driverForm, phone: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </>
            )}
            {activeTab === 'vehicles' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Modelo</label>
                  <input required value={vehicleForm.model} onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Placa</label>
                  <input required value={vehicleForm.plate} onChange={e => setVehicleForm({...vehicleForm, plate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Capacidade (kg)</label>
                  <input type="number" required value={vehicleForm.capacity} onChange={e => setVehicleForm({...vehicleForm, capacity: Number(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </>
            )}
            {activeTab === 'clients' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Razão Social</label>
                  <input required value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
                  <input type="email" required value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Endereço</label>
                  <input required value={clientForm.address} onChange={e => setClientForm({...clientForm, address: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </>
            )}
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-sm transition-all">Cadastrar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'drivers' && data.drivers.map(driver => (
          <div key={driver.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-4 relative">
              <img src={`https://picsum.photos/seed/${driver.id}/64/64`} className="w-14 h-14 rounded-full border-2 border-slate-100" alt="Motorista" />
              <div>
                <h4 className="font-bold text-slate-900">{driver.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${driver.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {driver.status === 'active' ? 'ATIVO' : 'INATIVO'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Hash size={16} />
                <span className="text-sm font-medium">{driver.license}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Phone size={16} />
                <span className="text-sm font-medium">{driver.phone}</span>
              </div>
            </div>
          </div>
        ))}
        {activeTab === 'vehicles' && data.vehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Truck size={24} />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  vehicle.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 
                  vehicle.status === 'maintenance' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {vehicle.status === 'available' ? 'DISPONÍVEL' : vehicle.status === 'maintenance' ? 'MANUTENÇÃO' : 'EM VIAGEM'}
                </span>
              </div>
              <h4 className="mt-4 font-bold text-slate-900 text-lg">{vehicle.plate}</h4>
              <p className="text-sm text-slate-500 font-medium">{vehicle.model}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>CAPACIDADE</span>
                <span className="text-slate-900">{vehicle.capacity.toLocaleString()} KG</span>
              </div>
            </div>
          </div>
        ))}
        {activeTab === 'clients' && data.clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Building2 size={24} />
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-lg mb-4">{client.name}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-500">
                <Mail size={16} />
                <span className="text-sm truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Building2 size={16} />
                <span className="text-sm truncate">{client.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationsPage;
