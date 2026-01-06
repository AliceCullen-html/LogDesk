
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  FileBarChart, 
  Settings,
  Bell,
  Search,
  Plus,
  BookOpen,
  MessageSquare,
  ArrowUpRight,
  LogOut,
  ChevronRight
} from 'lucide-react';

import DashboardPage from './pages/DashboardPage';
import TripsPage from './pages/TripsPage';
import CostsPage from './pages/CostsPage';
import OccurrencesPage from './pages/OccurrencesPage';
import RegistrationsPage from './pages/RegistrationsPage';
import ReportsPage from './pages/ReportsPage';

import { FreightDataState, Trip, Driver, Vehicle, Client, Cost, Occurrence } from './types';
import { INITIAL_TRIPS, INITIAL_DRIVERS, INITIAL_VEHICLES, INITIAL_CLIENTS, INITIAL_COSTS, INITIAL_OCCURRENCES } from './constants';

interface AppContextType {
  data: FreightDataState;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  addCost: (cost: Omit<Cost, 'id'>) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  addOccurrence: (occurrence: Omit<Occurrence, 'id'>) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};

const App: React.FC = () => {
  const [data, setData] = useState<FreightDataState>({
    trips: INITIAL_TRIPS,
    drivers: INITIAL_DRIVERS,
    vehicles: INITIAL_VEHICLES,
    clients: INITIAL_CLIENTS,
    costs: INITIAL_COSTS,
    occurrences: INITIAL_OCCURRENCES,
  });

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip = { ...trip, id: `t${Date.now()}` } as Trip;
    setData(prev => ({ ...prev, trips: [newTrip, ...prev.trips] }));
  };

  const addCost = (cost: Omit<Cost, 'id'>) => {
    const newCost = { ...cost, id: `co${Date.now()}` } as Cost;
    setData(prev => ({ ...prev, costs: [newCost, ...prev.costs] }));
  };

  const addDriver = (driver: Omit<Driver, 'id'>) => {
    const newDriver = { ...driver, id: `d${Date.now()}` } as Driver;
    setData(prev => ({ ...prev, drivers: [newDriver, ...prev.drivers] }));
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = { ...vehicle, id: `v${Date.now()}` } as Vehicle;
    setData(prev => ({ ...prev, vehicles: [newVehicle, ...prev.vehicles] }));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: `c${Date.now()}` } as Client;
    setData(prev => ({ ...prev, clients: [newClient, ...prev.clients] }));
  };

  const addOccurrence = (occurrence: Omit<Occurrence, 'id'>) => {
    const newOcc = { ...occurrence, id: `oc${Date.now()}` } as Occurrence;
    setData(prev => ({ ...prev, occurrences: [newOcc, ...prev.occurrences] }));
  };

  return (
    <AppContext.Provider value={{ data, addTrip, addCost, addDriver, addVehicle, addClient, addOccurrence }}>
      <HashRouter>
        <div className="flex flex-col md:flex-row h-screen w-full bg-[#F6F7F9] overflow-hidden">
          {/* Sidebar - Desktop & Bottom Nav - Mobile */}
          <Sidebar />
          
          {/* Main Container */}
          <div className="flex-1 flex flex-col overflow-hidden md:p-4 md:gap-4 h-full">
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white md:rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border-x border-t border-white pb-24 md:pb-0">
              <main className="p-6 md:p-10">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/trips" element={<TripsPage />} />
                  <Route path="/costs" element={<CostsPage />} />
                  <Route path="/occurrences" element={<OccurrencesPage />} />
                  <Route path="/registrations" element={<RegistrationsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, path: '/', label: 'Home' },
    { icon: Truck, path: '/trips', label: 'Trips' },
    { icon: DollarSign, path: '/costs', label: 'Costs' },
    { icon: AlertTriangle, path: '/occurrences', label: 'Alerts' },
    { icon: Users, path: '/registrations', label: 'Team' },
    { icon: FileBarChart, path: '/reports', label: 'Stats' },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-[88px] bg-white/70 backdrop-blur-2xl flex-col items-center py-10 gap-12 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.05)] border-r border-white/50 z-20">
        <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm">
          <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-white shadow-xl shadow-slate-200/50 text-slate-900 border border-slate-50' 
                    : 'text-slate-300 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-6">
          <button className="w-14 h-14 rounded-3xl flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-white transition-all">
            <Settings size={24} />
          </button>
          <div className="w-12 h-12 rounded-[1.2rem] overflow-hidden border-2 border-white shadow-md">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-4 z-50 pb-safe">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isActive ? 'text-blue-600 scale-110' : 'text-slate-400'
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default App;
