
import { TripStatus, Driver, Vehicle, Client, Trip, Cost, Occurrence } from './types';

export const INITIAL_DRIVERS: Driver[] = [
  { id: 'd1', name: 'João Silva', license: 'ABC-1234', phone: '(11) 98765-4321', status: 'active' },
  { id: 'd2', name: 'Ana Souza', license: 'XYZ-5678', phone: '(21) 91234-5678', status: 'active' },
  { id: 'd3', name: 'Marcos Oliveira', license: 'DEF-9012', phone: '(31) 99876-5432', status: 'inactive' },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'v1', model: 'Volvo FH16', plate: 'LOG-0001', capacity: 25000, status: 'available' },
  { id: 'v2', model: 'Scania R500', plate: 'LOG-0002', capacity: 22000, status: 'busy' },
  { id: 'v3', model: 'Mercedes Actros', plate: 'LOG-0003', capacity: 28000, status: 'maintenance' },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Varejo Global S.A.', email: 'logistica@global.com.br', address: 'Av. Paulista, 1000, SP' },
  { id: 'c2', name: 'Indústria Direta', email: 'expedicao@industria.com.br', address: 'Distrito Industrial, Manaus' },
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 't1',
    origin: 'São Paulo',
    destination: 'Curitiba',
    departureDate: '2025-03-01',
    arrivalDate: '2025-03-02',
    status: TripStatus.DELIVERED,
    driverId: 'd1',
    vehicleId: 'v1',
    clientId: 'c1',
    cargoWeight: 15000,
    revenue: 5200,
    distanceKm: 400
  },
  {
    id: 't2',
    origin: 'Rio de Janeiro',
    destination: 'Belo Horizonte',
    departureDate: '2025-03-05',
    arrivalDate: '2025-03-06',
    status: TripStatus.DELIVERED,
    driverId: 'd2',
    vehicleId: 'v2',
    clientId: 'c2',
    cargoWeight: 8000,
    revenue: 3100,
    distanceKm: 440
  },
  {
    id: 't3',
    origin: 'Curitiba',
    destination: 'Porto Alegre',
    departureDate: '2025-03-10',
    arrivalDate: '2025-03-12',
    status: TripStatus.DELIVERED,
    driverId: 'd1',
    vehicleId: 'v1',
    clientId: 'c1',
    cargoWeight: 12000,
    revenue: 4800,
    distanceKm: 730
  },
  {
    id: 't4',
    origin: 'São Paulo',
    destination: 'Cuiabá',
    departureDate: '2025-03-15',
    arrivalDate: '2025-03-19',
    status: TripStatus.DELIVERED,
    driverId: 'd3',
    vehicleId: 'v3',
    clientId: 'c1',
    cargoWeight: 20000,
    revenue: 12500,
    distanceKm: 1500
  },
  {
    id: 't5',
    origin: 'Belo Horizonte',
    destination: 'Rio de Janeiro',
    departureDate: '2025-03-20',
    arrivalDate: '2025-03-21',
    status: TripStatus.IN_TRANSIT,
    driverId: 'd2',
    vehicleId: 'v2',
    clientId: 'c2',
    cargoWeight: 10000,
    revenue: 3800,
    distanceKm: 440
  }
];

export const INITIAL_COSTS: Cost[] = [
  { id: 'co1', tripId: 't1', category: 'fuel', amount: 850, date: '2025-03-01', description: 'Diesel inicial' },
  { id: 'co2', tripId: 't1', category: 'toll', amount: 120, date: '2025-03-01', description: 'Pedágios' },
  { id: 'co3', tripId: 't3', category: 'fuel', amount: 1100, date: '2025-03-10', description: 'Diesel S10' },
  { id: 'co4', tripId: 't4', category: 'fuel', amount: 4200, date: '2025-03-15', description: 'Diesel longa distância' },
  { id: 'co5', tripId: 't2', category: 'maintenance', amount: 450, date: '2025-03-05', description: 'Troca de Óleo' },
];

export const INITIAL_OCCURRENCES: Occurrence[] = [
  { id: 'oc1', tripId: 't2', type: 'delay', severity: 'low', date: '2025-03-05', description: 'Congestionamento na saída do Rio' }
];
