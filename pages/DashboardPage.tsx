
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { analyzeFreightPerformance } from '../services/geminiService';
import { 
  Sparkles,
  TrendingUp,
  ArrowRight,
  Zap,
  Wallet,
  Clock,
  MessageSquare,
  Navigation,
  BarChart3,
  Target,
  Truck,
  Users,
  Info,
  Map as MapIcon,
  Scale,
  X
} from 'lucide-react';
import { TripStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const CITY_COORDS: Record<string, [number, number]> = {
  'São Paulo': [-23.5505, -46.6333],
  'Curitiba': [-25.4290, -49.2671],
  'Porto Alegre': [-30.0346, -51.2177],
  'Cuiabá': [-15.6014, -56.0979],
  'Rio de Janeiro': [-22.9068, -43.1729],
  'Belo Horizonte': [-19.9167, -43.9345],
  'Manaus': [-3.1190, -60.0217],
  'Brasília': [-15.7975, -47.8919]
};

const KPICard = ({ label, value, sub, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4 transition-all hover:scale-[1.02]">
    <div className="flex items-center justify-between">
      <div className={`p-2.5 md:p-3 rounded-2xl bg-slate-50 ${color}`}>
        <Icon size={20} className="md:w-6 md:h-6" />
      </div>
      <span className={`text-[9px] md:text-[10px] font-black px-2 py-1 rounded-lg ${
        trend.includes('🚨') || trend.includes('BAIXO') || trend.includes('↓') || trend.startsWith('-')
          ? 'bg-rose-50 text-rose-500' 
          : 'bg-emerald-50 text-emerald-600'
      }`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h4 className="text-xl md:text-2xl font-black text-slate-900 mt-1">{value}</h4>
      <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-1">{sub}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { data } = useApp();
  const [activeTab, setActiveTab] = useState<'geral' | 'mapa' | 'veiculos'>('geral');
  const [revenueGrouping, setRevenueGrouping] = useState<'mes' | 'destino'>('destino');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mapInstanceRef = useRef<any>(null);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  const filteredTrips = useMemo(() => {
    if (!selectedDestination) return data.trips;
    return data.trips.filter(t => t.destination === selectedDestination);
  }, [data.trips, selectedDestination]);

  const filteredCosts = useMemo(() => {
    const tripIds = new Set(filteredTrips.map(t => t.id));
    if (!selectedDestination) return data.costs;
    return data.costs.filter(c => tripIds.has(c.tripId));
  }, [data.costs, filteredTrips, selectedDestination]);

  const stats = useMemo(() => {
    const totalRevenue = filteredTrips.reduce((acc, t) => acc + (t.revenue || 0), 0);
    const totalCosts = filteredCosts.reduce((acc, c) => acc + (c.amount || 0), 0);
    const netProfit = totalRevenue - totalCosts;
    const totalKm = filteredTrips.reduce((acc, t) => acc + (t.distanceKm || 0), 0);
    return {
      totalRevenue,
      totalCosts,
      netProfit,
      margin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0",
      costPerKm: totalKm > 0 ? (totalCosts / totalKm).toFixed(2) : "0",
      slaRate: filteredTrips.length > 0 ? ((filteredTrips.filter(t => t.status === TripStatus.DELIVERED).length / filteredTrips.length) * 100).toFixed(0) : "0"
    };
  }, [filteredTrips, filteredCosts]);

  const chartData = useMemo(() => {
    if (revenueGrouping === 'destino') {
      const destMap: Record<string, { receita: number, custo: number }> = {};
      filteredTrips.forEach(trip => {
        const dest = trip.destination || 'Indefinido';
        if (!destMap[dest]) destMap[dest] = { receita: 0, custo: 0 };
        destMap[dest].receita += (trip.revenue || 0);
        const tripCosts = filteredCosts.filter(c => c.tripId === trip.id).reduce((sum, c) => sum + (c.amount || 0), 0);
        destMap[dest].custo += tripCosts;
      });
      return Object.entries(destMap).map(([name, values]) => ({ 
        name: name.split(' ')[0], 
        receita: values.receita, 
        custo: values.custo,
        fullName: name,
        isSelected: name === selectedDestination 
      })).sort((a,b) => b.receita - a.receita);
    }
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((m, idx) => ({
      name: m,
      receita: filteredTrips.filter(t => new Date(t.departureDate).getMonth() === idx).reduce((s,t) => s+(t.revenue||0), 0),
      custo: filteredCosts.filter(c => new Date(c.date).getMonth() === idx).reduce((s,c) => s+(c.amount||0), 0)
    })).filter((item, idx) => item.receita > 0 || item.custo > 0 || idx <= new Date().getMonth());
  }, [filteredTrips, filteredCosts, revenueGrouping, selectedDestination]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const L = (window as any).L;
      if (!L) return;
      const containerId = activeTab === 'mapa' ? 'logimap-full' : 'logimap-mini';
      const mapContainer = document.getElementById(containerId);
      if (!mapContainer) return;
      if (mapInstanceRef.current) mapInstanceRef.current.remove();
      const map = L.map(containerId, {
        center: [-15.7801, -47.9292],
        zoom: activeTab === 'mapa' ? 4 : 3.5,
        zoomControl: activeTab === 'mapa',
        attributionControl: false
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
      const destPoints: Record<string, { receita: number, trips: number, totalWeight: number }> = {};
      data.trips.forEach(t => {
        if (!destPoints[t.destination]) destPoints[t.destination] = { receita: 0, trips: 0, totalWeight: 0 };
        destPoints[t.destination].receita += (t.revenue || 0);
        destPoints[t.destination].trips += 1;
        destPoints[t.destination].totalWeight += (t.cargoWeight || 0);
      });
      Object.entries(destPoints).forEach(([city, info]) => {
        const coords = CITY_COORDS[city];
        if (coords) {
          const isSelected = city === selectedDestination;
          const tons = info.totalWeight / 1000;
          const avgPerTon = tons > 0 ? (info.receita / tons) : 0;
          const radius = Math.min(Math.max(info.receita / 400, 10), 28);
          const circle = L.circleMarker(coords, {
            radius: isSelected ? radius + 4 : radius,
            fillColor: isSelected ? '#d9ff54' : (info.receita > 8000 ? '#2d6cf6' : '#ff4f9a'),
            color: isSelected ? '#000' : '#fff',
            weight: isSelected ? 4 : 2,
            opacity: 1,
            fillOpacity: selectedDestination ? (isSelected ? 1 : 0.3) : 0.85
          }).addTo(map);
          circle.on('click', () => {
            setSelectedDestination(city === selectedDestination ? null : city);
            setAiAnalysis(null);
          });
          circle.bindTooltip(`
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 8px; background: white;">
              <b style="font-size: 14px; color: #0f172a;">${city}</b>
              <div style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase;">Clique para filtrar</div>
              <div style="color: #2d6cf6; font-size: 16px; font-weight: 900; margin-top: 4px;">R$ ${info.receita.toLocaleString('pt-BR')}</div>
            </div>
          `, { sticky: true, className: 'custom-map-tooltip', opacity: 1 });
        }
      });
      mapInstanceRef.current = map;
    }, 150);
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, data.trips, selectedDestination]);

  const handleAiAnalyze = async () => {
    setIsAnalyzing(true);
    const analysisData = { ...data, trips: filteredTrips, costs: filteredCosts };
    const result = await analyzeFreightPerformance(analysisData);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full animate-in fade-in duration-700">
      
      {/* HEADER RESPONSIVO */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-slate-900 flex flex-wrap items-center gap-2 md:gap-4">
            Intelligence
            {selectedDestination && (
              <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black animate-in slide-in-from-left">
                <MapIcon size={12} className="text-brand-lime" />
                {selectedDestination.toUpperCase()}
                <button onClick={() => setSelectedDestination(null)} className="ml-1 p-0.5 hover:bg-white/10 rounded">
                  <X size={12} />
                </button>
              </div>
            )}
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">
            {selectedDestination ? `Filtrando rota: ${selectedDestination}` : 'Monitoramento em tempo real.'}
          </p>
        </div>
        
        {/* TAB NAVIGATION MOBILE FRIENDLY */}
        <div className="overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-max">
             {(['geral', 'mapa', 'veiculos'] as const).map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
               >
                 {tab === 'geral' ? 'Dash' : tab === 'mapa' ? 'Malha' : 'Ativos'}
               </button>
             ))}
          </div>
        </div>
      </header>

      {/* KPI GRID RESPONSIVO */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="col-span-1"><KPICard label="Lucro Líquido" value={`R$ ${stats.netProfit.toLocaleString()}`} sub="Resultado Real" trend="↑ 12%" icon={Wallet} color="text-emerald-600" /></div>
        <div className="col-span-1"><KPICard label="Margem Média" value={`${stats.margin}%`} sub="Rentabilidade" trend="+2.1%" icon={Zap} color="text-blue-600" /></div>
        <div className="col-span-1"><KPICard label="SLA de Prazo" value={`${stats.slaRate}%`} sub="Eficiência" trend={Number(stats.slaRate) < 70 ? "🚨 BAIXO" : "✅ OK"} icon={Clock} color={Number(stats.slaRate) < 70 ? "text-rose-500" : "text-emerald-600"} /></div>
        <div className="col-span-1"><KPICard label="Custo / KM" value={`R$ ${stats.costPerKm}`} sub="Gasto Médio" trend="-R$0.04" icon={Navigation} color="text-rose-600" /></div>
        <div className="col-span-2 lg:col-span-1"><KPICard label="Viagens" value={filteredTrips.length} sub="Total Período" trend="Ativa" icon={Truck} color="text-slate-600" /></div>
      </section>

      {activeTab === 'geral' && (
        <div className="flex flex-col gap-6 md:gap-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            {/* CHART SECTION */}
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm p-6 md:p-10 flex flex-col min-h-[400px]">
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                  <h3 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                    <Target className="text-blue-600" size={24} /> 
                    {selectedDestination ? `Histórico: ${selectedDestination}` : 'Finanças'}
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl self-start">
                     <button onClick={() => setRevenueGrouping('mes')} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${revenueGrouping === 'mes' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}>Mensal</button>
                     <button onClick={() => setRevenueGrouping('destino')} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${revenueGrouping === 'destino' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}>Destino</button>
                  </div>
               </div>

               <div className="flex-1 w-full h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 25, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 900 }} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                        cursor={{ fill: '#f8fafc' }} 
                        formatter={(val: number) => [formatCurrency(val), ""]}
                      />
                      <Bar 
                        name="Receita" 
                        dataKey="receita" 
                        fill="#2d6cf6" 
                        radius={[6, 6, 0, 0]} 
                        barSize={24}
                        label={{ 
                          position: 'top', 
                          formatter: formatCurrency, 
                          fill: '#2d6cf6', 
                          fontSize: 8, 
                          fontWeight: 800,
                          dy: -8 
                        }}
                      >
                        {chartData.map((entry: any, index: number) => (
                           <Cell 
                            key={`cell-${index}`} 
                            fill={selectedDestination && entry.fullName === selectedDestination ? '#d9ff54' : '#2d6cf6'} 
                           />
                        ))}
                      </Bar>
                      <Bar 
                        name="Gastos" 
                        dataKey="custo" 
                        fill="#ff4f9a" 
                        radius={[6, 6, 0, 0]} 
                        barSize={24}
                        label={{ 
                          position: 'top', 
                          formatter: formatCurrency, 
                          fill: '#ff4f9a', 
                          fontSize: 8, 
                          fontWeight: 800,
                          dy: -8
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* MINI MAP SECTION */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm p-6 md:p-10 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                  <MapIcon className="text-emerald-500" size={24} /> Malha Ativa
                </h3>
              </div>
              <div className="flex-1 w-full rounded-[2rem] bg-slate-100 overflow-hidden relative border border-slate-200 shadow-inner">
                <div id="logimap-mini" style={{ height: '100%', width: '100%' }}></div>
              </div>
              {selectedDestination && (
                <button onClick={() => setSelectedDestination(null)} className="mt-4 text-[10px] font-black uppercase text-rose-500 hover:underline self-center">Limpar Filtro</button>
              )}
            </div>
          </div>

          {/* AI SECTION */}
          <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 pointer-events-none rotate-12">
              <Sparkles size={150} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 mb-4">
                    <Zap size={10} /> IA ESTRATÉGICA
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter">
                    {selectedDestination ? `Insight: ${selectedDestination}` : 'Estrategista Logístico'}
                  </h3>
                </div>
                <button 
                  onClick={handleAiAnalyze}
                  disabled={isAnalyzing}
                  className="px-5 py-3 md:px-6 md:py-3 bg-white text-slate-900 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl w-full md:w-auto"
                >
                  {isAnalyzing ? <div className="animate-spin border-2 border-slate-900 border-t-transparent w-4 h-4 rounded-full" /> : <Sparkles size={16} />}
                  {isAnalyzing ? 'Processando...' : 'Gerar Insight'}
                </button>
              </div>

              <div className="mt-8 flex-1 overflow-y-auto custom-scrollbar-light pr-4 max-h-[250px] md:max-h-[300px]">
                {aiAnalysis ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="bg-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 text-slate-300 font-medium leading-relaxed whitespace-pre-line text-xs md:text-sm">
                      {aiAnalysis}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs md:text-sm font-medium max-w-md">
                    Analise rotas, custos e tempo médio com o motor de inteligência avançado do LogiFlow.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mapa' && (
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm p-4 md:p-8 flex flex-col h-[500px] md:h-[700px] animate-in zoom-in duration-500">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Geolocalização</h2>
                <p className="text-[10px] md:text-sm text-slate-500 font-medium italic">Clique nas regiões para detalhamento.</p>
              </div>
              <button onClick={() => setSelectedDestination(null)} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-xl self-start">Limpar Seleção</button>
           </div>
           <div className="flex-1 w-full rounded-[2rem] border border-slate-100 shadow-inner overflow-hidden">
             <div id="logimap-full" style={{ height: '100%', width: '100%' }}></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
