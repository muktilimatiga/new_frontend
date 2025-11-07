import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Download, Edit, Eye, Plus, Search } from 'lucide-react'
import {
  filterFns,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { Customer, SearchFilters } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

function BroadbandSearch() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: Array<ColumnDef<Customer>> = [
      {
        accessorKey: 'id',
        header: 'Customer ID',
        cell: ({ row }) => {
          const id = row.getValue('id')
          return typeof id === 'string' ? (
            <div className="font-medium">{id}</div>
          ) : null
        },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const name = row.getValue('name')
          return typeof name === 'string' ? <div>{name}</div> : null
        },
      },
      {
        accessorKey: 'serviceType',
        header: 'Service Type',
        cell: ({ row }) => {
          const serviceType = row.getValue('serviceType')
          return typeof serviceType === 'string' ? (
            <Badge variant="outline">{serviceType}</Badge>
          ) : null
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => (
          <div className="max-w-xs truncate">
            {row.original.location.address}
          </div>
        ),
      },
      {
        accessorKey: 'plan',
        header: 'Plan',
        cell: ({ row }) => {
          const plan = row.getValue('plan')
          return typeof plan === 'string' ? <div>{plan}</div> : null
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status')
          // Type guard to ensure status is a string
          if (typeof status !== 'string') {
            return null
          }
          
          return (
            <Badge
              className={
                status === 'active'
                  ? 'bg-green-500'
                  : status === 'inactive'
                  ? 'bg-gray-500'
                  : 'bg-yellow-500'
              }
            >
              {status}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last Update',
        cell: ({ row }) => {
          const value = row.getValue('updatedAt')
          return (
            <div>{value instanceof Date 
              ? value.toLocaleDateString() 
              : ''
            }</div>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('View details', row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Edit customer', row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Create ticket', row.original)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ]

  const table = useReactTable({
    data: mockCustomers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      ...filterFns,
      fuzzy: (row, columnId, value, addMeta) => {
        const cellValue = row.getValue(columnId)
        if (typeof cellValue === 'string') {
          return cellValue.toLowerCase().includes(value.toLowerCase())
        }
        return false
      },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  const handleExport = () => {
    console.log('Exporting data...')
    // In a real implementation, this would export filtered data
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Broadband Search</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>
            Search for customers and apply filters to narrow down results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={searchFilters.serviceType || ''}
              onValueChange={(value: string) => handleFilterChange('serviceType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fiber Broadband">Fiber Broadband</SelectItem>
                <SelectItem value="Cable Internet">Cable Internet</SelectItem>
                <SelectItem value="DSL">DSL</SelectItem>
                <SelectItem value="Satellite">Satellite</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={searchFilters.status || ''}
              onValueChange={(value: string) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Location..."
              value={searchFilters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            {table.getFilteredRowModel().rows.length} customers found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 text-left font-medium">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/broadband-search')({
  component: BroadbandSearch,
})