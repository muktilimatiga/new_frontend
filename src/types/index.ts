// Ticket System
export interface Ticket {
  id: string;
  customerId: string;
  title: string;
  description?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  resolvedAt?: Date;
}

// Customer Data Structure
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  location: {
    address: string;
    coordinates: [number, number]; // [latitude, longitude]
  };
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

// Network Device
export interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'server' | 'access-point';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  location: {
    address: string;
    coordinates: [number, number];
  };
  ipAddress: string;
  macAddress: string;
  model: string;
  firmware: string;
  lastSeen: Date;
  connections: Array<string>; // Array of connected device IDs
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'operator' | 'viewer';
  department: string;
  avatar?: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
}

// Dashboard Metrics
export interface DashboardMetrics {
  weeklyTicketStats: {
    total: number;
    resolved: number;
    pending: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
  };
  openTickets: Array<Ticket>;
  performanceMetrics: {
    averageResolutionTime: number; // in hours
    slaCompliance: number; // percentage
    ticketsHandledToday: number;
    customerSatisfaction: number; // 1-5 scale
  };
  dailyTicketVolume: Array<{
    date: string;
    count: number;
  }>;
  ticketStatusDistribution: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'ticket_created' | 'ticket_updated' | 'ticket_resolved' | 'device_added';
    description: string;
    timestamp: Date;
    userId: string;
  }>;
}

// Search Filters
export interface SearchFilters {
  customerId?: string;
  serviceType?: string;
  location?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Topology Node
export interface TopologyNode {
  id: string;
  type: 'router' | 'switch' | 'firewall' | 'server' | 'access-point' | 'customer';
  position: { x: number; y: number };
  data: {
    label: string;
    status: 'online' | 'offline' | 'maintenance' | 'error';
    deviceType: string;
    ipAddress?: string;
    details?: Record<string, any>;
  };
}

// Topology Edge
export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  type: 'default' | 'straight' | 'step' | 'smoothstep';
  data?: {
    connectionType: string;
    bandwidth?: string;
    status?: 'active' | 'inactive';
  };
}

// Database Table Info
export interface DatabaseTable {
  name: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    primaryKey: boolean;
  }>;
  rowCount: number;
  lastUpdated: Date;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Theme
export type Theme = 'light' | 'dark' | 'system';

// Notification
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}