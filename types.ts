
export enum TripStatus {
  PLANNED = 'Planejada',
  IN_TRANSIT = 'Em Trânsito',
  DELIVERED = 'Entregue',
  CANCELLED = 'Cancelada'
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  capacity: number;
  status: 'available' | 'maintenance' | 'busy';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  estimatedArrival?: string;
  status: TripStatus;
  driverId: string;
  vehicleId: string;
  clientId: string;
  cargoWeight: number;
  valuePerTon?: number;
  revenue: number;
  distanceKm: number; // Campo adicionado
}

export interface Cost {
  id: string;
  tripId: string;
  category: 'fuel' | 'maintenance' | 'toll' | 'salary' | 'other';
  amount: number;
  date: string;
  description: string;
}

export interface Occurrence {
  id: string;
  tripId: string;
  type: 'accident' | 'delay' | 'breakdown' | 'theft' | 'other';
  severity: 'low' | 'medium' | 'high';
  date: string;
  description: string;
}

export interface FreightDataState {
  trips: Trip[];
  drivers: Driver[];
  vehicles: Vehicle[];
  clients: Client[];
  costs: Cost[];
  occurrences: Occurrence[];
}
