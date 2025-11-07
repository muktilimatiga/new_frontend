import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy, useState } from 'react'
import { Plus } from 'lucide-react'
import type { Customer } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data for demonstration
const mockCustomers: Array<Customer> = [
  {
    id: 'cust-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    serviceType: 'Fiber Broadband',
    location: {
      address: '123 Main St, New York, NY 10001',
      coordinates: [40.7128, -74.0060],
    },
    plan: 'Premium 1Gbps',
    status: 'active',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'cust-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0102',
    serviceType: 'Cable Internet',
    location: {
      address: '456 Oak Ave, Los Angeles, CA 90001',
      coordinates: [34.0522, -118.2437],
    },
    plan: 'Standard 500Mbps',
    status: 'active',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'cust-003',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '+1-555-0103',
    serviceType: 'Fiber Broadband',
    location: {
      address: '789 Pine Rd, Chicago, IL 60601',
      coordinates: [41.8781, -87.6298],
    },
    plan: 'Basic 100Mbps',
    status: 'suspended',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 'cust-004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1-555-0104',
    serviceType: 'DSL',
    location: {
      address: '321 Elm St, Houston, TX 77001',
      coordinates: [29.7604, -95.3698],
    },
    plan: 'Basic 50Mbps',
    status: 'inactive',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: 'cust-005',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    phone: '+1-555-0105',
    serviceType: 'Fiber Broadband',
    location: {
      address: '654 Maple Dr, Phoenix, AZ 85001',
      coordinates: [33.4484, -112.0740],
    },
    plan: 'Premium 1Gbps',
    status: 'active',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-01-08'),
  },
]

// Lazy load the MapComponent to avoid SSR issues with Leaflet
const MapComponent = lazy(() => import('@/components/MapComponent').then(mod => ({ default: mod.MapComponent })))

function GeographicMaps() {
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'Fiber Broadband':
        return '#3b82f6'
      case 'Cable Internet':
        return '#06b6d4'
      case 'DSL':
        return '#8b5cf6'
      case 'Satellite':
        return '#f97316'
      default:
        return '#6b7280'
    }
  }

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesServiceType = selectedServiceType === 'all' || customer.serviceType === selectedServiceType
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus
    return matchesServiceType && matchesStatus
  })

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  const handleAddCustomer = () => {
    console.log('Add new customer')
    // In a real implementation, this would open a form to add a new customer
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Geographic Maps</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddCustomer}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter customers by service type and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2">Service Type</label>
              <Select
                value={selectedServiceType}
                onValueChange={(value: string) => setSelectedServiceType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Service Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Service Types</SelectItem>
                  <SelectItem value="Fiber Broadband">Fiber Broadband</SelectItem>
                  <SelectItem value="Cable Internet">Cable Internet</SelectItem>
                  <SelectItem value="DSL">DSL</SelectItem>
                  <SelectItem value="Satellite">Satellite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2">Status</label>
              <Select
                value={selectedStatus}
                onValueChange={(value: string) => setSelectedStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Locations</CardTitle>
          <CardDescription>
            {filteredCustomers.length} customers found. Click on markers for details.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<div className="flex items-center justify-center h-[500px] bg-gray-100">Loading map...</div>}>
            <MapComponent
              customers={filteredCustomers}
              onCustomerClick={handleCustomerClick}
              getServiceTypeColor={getServiceTypeColor}
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Customer Details */}
      {selectedCustomer && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>
              Detailed information about {selectedCustomer.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{selectedCustomer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{selectedCustomer.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Service Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Service Type:</span>
                    <span className="text-sm">{selectedCustomer.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Plan:</span>
                    <span className="text-sm">{selectedCustomer.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      className={`${
                        selectedCustomer.status === 'active'
                          ? 'bg-green-500'
                          : selectedCustomer.status === 'inactive'
                          ? 'bg-gray-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Address:</span>
                    <span className="text-sm">{selectedCustomer.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Coordinates:</span>
                    <span className="text-sm">
                      {selectedCustomer.location.coordinates[0]}, {selectedCustomer.location.coordinates[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const Route = createFileRoute('/geographic-maps')({
  ssr: false, // Add this here too
  component: GeographicMaps,
})