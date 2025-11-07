import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Download, Plus, RefreshCw, Search } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { DatabaseTable, NetworkDevice, Ticket, User } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

// Mock data for demonstration
const mockUsers: Array<User> = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    department: 'IT',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2023-01-10'),
  },
  {
    id: 'user-002',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'technician',
    department: 'Network Operations',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:15:00'),
    createdAt: new Date('2023-02-15'),
  },
  {
    id: 'user-003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'operator',
    department: 'Customer Support',
    isActive: false,
    lastLogin: new Date('2024-01-14T14:20:00'),
    createdAt: new Date('2023-03-20'),
  },
]

const mockTickets: Array<Ticket> = [
  {
    id: 'ticket-001',
    customerId: 'cust-001',
    title: 'Internet connection issues',
    status: 'open',
    priority: 'high',
    assignedTo: 'tech-001',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
    dueDate: new Date('2024-01-16T10:30:00'),
  },
  {
    id: 'ticket-002',
    customerId: 'cust-002',
    title: 'Router configuration needed',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'tech-002',
    createdAt: new Date('2024-01-14T09:15:00'),
    updatedAt: new Date('2024-01-14T11:45:00'),
    dueDate: new Date('2024-01-17T09:15:00'),
  },
  {
    id: 'ticket-003',
    customerId: 'cust-003',
    title: 'Network outage in downtown area',
    status: 'resolved',
    priority: 'critical',
    assignedTo: 'tech-001',
    createdAt: new Date('2024-01-13T08:00:00'),
    updatedAt: new Date('2024-01-13T16:30:00'),
    resolvedAt: new Date('2024-01-13T12:00:00'),
  },
]

const mockNetworkDevices: Array<NetworkDevice> = [
  {
    id: 'device-001',
    name: 'Core Router',
    type: 'router',
    status: 'online',
    location: {
      address: '123 Main St, New York, NY 10001',
      coordinates: [40.7128, -74.0060],
    },
    ipAddress: '192.168.1.1',
    macAddress: '00:11:22:33:44:55',
    model: 'Cisco ISR 4321',
    firmware: 'v15.2(2)S',
    lastSeen: new Date('2024-01-15T10:30:00'),
    connections: ['device-002', 'device-003'],
  },
  {
    id: 'device-002',
    name: 'Distribution Switch',
    type: 'switch',
    status: 'online',
    location: {
      address: '456 Oak Ave, Los Angeles, CA 90001',
      coordinates: [34.0522, -118.2437],
    },
    ipAddress: '192.168.1.10',
    macAddress: '00:11:22:33:44:66',
    model: 'Cisco Catalyst 2960',
    firmware: 'v15.2(2)S',
    lastSeen: new Date('2024-01-15T09:45:00'),
    connections: ['device-001', 'device-003'],
  },
]

const mockDatabaseTables: Array<DatabaseTable> = [
  {
    name: 'customers',
    columns: [
      { name: 'id', type: 'string', nullable: false, primaryKey: true },
      { name: 'name', type: 'string', nullable: false, primaryKey: false },
      { name: 'email', type: 'string', nullable: false, primaryKey: false },
      { name: 'phone', type: 'string', nullable: true, primaryKey: false },
      { name: 'serviceType', type: 'string', nullable: false, primaryKey: false },
      { name: 'location', type: 'object', nullable: true, primaryKey: false },
      { name: 'plan', type: 'string', nullable: false, primaryKey: false },
      { name: 'status', type: 'string', nullable: false, primaryKey: false },
      { name: 'createdAt', type: 'date', nullable: false, primaryKey: false },
      { name: 'updatedAt', type: 'date', nullable: false, primaryKey: false },
    ],
    rowCount: 1250,
    lastUpdated: new Date('2024-01-15T12:00:00'),
  },
  {
    name: 'tickets',
    columns: [
      { name: 'id', type: 'string', nullable: false, primaryKey: true },
      { name: 'customerId', type: 'string', nullable: false, primaryKey: false },
      { name: 'title', type: 'string', nullable: false, primaryKey: false },
      { name: 'status', type: 'string', nullable: false, primaryKey: false },
      { name: 'priority', type: 'string', nullable: false, primaryKey: false },
      { name: 'assignedTo', type: 'string', nullable: true, primaryKey: false },
      { name: 'createdAt', type: 'date', nullable: false, primaryKey: false },
      { name: 'updatedAt', type: 'date', nullable: false, primaryKey: false },
      { name: 'dueDate', type: 'date', nullable: true, primaryKey: false },
      { name: 'resolvedAt', type: 'date', nullable: true, primaryKey: false },
    ],
    rowCount: 342,
    lastUpdated: new Date('2024-01-15T14:30:00'),
  },
  {
    name: 'network_devices',
    columns: [
      { name: 'id', type: 'string', nullable: false, primaryKey: true },
      { name: 'name', type: 'string', nullable: false, primaryKey: false },
      { name: 'type', type: 'string', nullable: false, primaryKey: false },
      { name: 'status', type: 'string', nullable: false, primaryKey: false },
      { name: 'location', type: 'object', nullable: true, primaryKey: false },
      { name: 'ipAddress', type: 'string', nullable: false, primaryKey: false },
      { name: 'macAddress', type: 'string', nullable: false, primaryKey: false },
      { name: 'model', type: 'string', nullable: false, primaryKey: false },
      { name: 'firmware', type: 'string', nullable: false, primaryKey: false },
      { name: 'lastSeen', type: 'date', nullable: false, primaryKey: false },
    ],
    rowCount: 48,
    lastUpdated: new Date('2024-01-15T11:00:00'),
  },
  {
    name: 'users',
    columns: [
      { name: 'id', type: 'string', nullable: false, primaryKey: true },
      { name: 'name', type: 'string', nullable: false, primaryKey: false },
      { name: 'email', type: 'string', nullable: false, primaryKey: false },
      { name: 'role', type: 'string', nullable: false, primaryKey: false },
      { name: 'department', type: 'string', nullable: false, primaryKey: false },
      { name: 'isActive', type: 'boolean', nullable: false, primaryKey: false },
      { name: 'lastLogin', type: 'date', nullable: true, primaryKey: false },
      { name: 'createdAt', type: 'date', nullable: false, primaryKey: false },
    ],
    rowCount: 15,
    lastUpdated: new Date('2024-01-15T10:00:00'),
  },
]

function DatabaseManagement() {
  const [activeTab, setActiveTab] = useState('customers')
  const [globalFilter, setGlobalFilter] = useState('')

  const userColumns: Array<ColumnDef<User>> = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div>{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <div>{row.getValue('role')}</div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <div>{row.getValue('department')}</div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive')
        return (
          <Badge
            className={isActive ? 'bg-green-500' : 'bg-red-500'}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => {
        const value = row.getValue('lastLogin')
        return (
          <div>{value instanceof Date ? value.toLocaleDateString() : ''}</div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const value = row.getValue('createdAt')
        return (
          <div>{value instanceof Date ? value.toLocaleDateString() : ''}</div>
        )
      },
    },
  ]

  const ticketColumns: Array<ColumnDef<Ticket>> = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'customerId',
      header: 'Customer ID',
      cell: ({ row }) => (
        <div>{row.getValue('customerId')}</div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status')
        return (
          <Badge
            className={
              status === 'open'
                ? 'bg-red-500'
                : status === 'in-progress'
                ? 'bg-yellow-500'
                : status === 'resolved'
                ? 'bg-green-500'
                : 'bg-gray-500'
            }
          >
            {status as string}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority')
        return (
          <Badge
            className={
              priority === 'critical'
                ? 'bg-red-500'
                : priority === 'high'
                ? 'bg-orange-500'
                : priority === 'medium'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }
          >
            {priority as string}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned To',
      cell: ({ row }) => (
        <div>{row.getValue('assignedTo')}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const value = row.getValue('createdAt')
        return (
          <div>{value instanceof Date ? value.toLocaleDateString() : ''}</div>
        )
      },
    },
  ]

  const deviceColumns: Array<ColumnDef<NetworkDevice>> = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div>{row.getValue('type')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status')
        return (
          <Badge
            className={
              status === 'online'
                ? 'bg-green-500'
                : status === 'offline'
                ? 'bg-red-500'
                : 'bg-yellow-500'
            }
          >
            {status as string}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: ({ row }) => (
        <div>{row.getValue('ipAddress')}</div>
      ),
    },
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: ({ row }) => {
        const value = row.getValue('lastSeen')
        return (
          <div>{value instanceof Date ? value.toLocaleDateString() : ''}</div>
        )
      },
    },
  ]

  const userTable = useReactTable({
    data: mockUsers,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      fuzzy: () => false,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  const ticketTable = useReactTable({
    data: mockTickets,
    columns: ticketColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      fuzzy: () => false,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  const deviceTable = useReactTable({
    data: mockNetworkDevices,
    columns: deviceColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      fuzzy: () => false,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  const handleExport = () => {
    console.log('Exporting database data...')
    // In a real implementation, this would export the filtered data
  }

  const handleRefresh = () => {
    console.log('Refreshing database data...')
    // In a real implementation, this would refresh the data from the database
  }

  const handleAddUser = () => {
    console.log('Add new user')
    // In a real implementation, this would open a form to add a new user
  }

  const handleAddTicket = () => {
    console.log('Add new ticket')
    // In a real implementation, this would open a form to add a new ticket
  }

  const handleAddDevice = () => {
    console.log('Add new device')
    // In a real implementation, this would open a form to add a new device
  }

  const renderTable = (table: any) => (
    <>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
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
              table.getRowModel().rows.map((row: any) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell: any) => (
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
                  colSpan={table.getAllColumns().length}
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
    </>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Database Management</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Database Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Health</CardTitle>
            <CardDescription>Overall database status and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Tables</span>
                <span className="text-2xl font-bold">{mockDatabaseTables.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Records</span>
                <span className="text-2xl font-bold">
                  {mockDatabaseTables.reduce((sum, table) => sum + table.rowCount, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Backup</span>
                <span className="text-sm">2 days ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-sm">45.2 GB / 100 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Connections</CardTitle>
            <CardDescription>Current database connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Database Server</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Replication Server</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Synced</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="network_devices">Network Devices</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Manage customer accounts and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleAddUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
              {renderTable(userTable)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
              <CardDescription>
                Manage support tickets and issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleAddTicket}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ticket
                </Button>
              </div>
              {renderTable(ticketTable)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network_devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Devices</CardTitle>
              <CardDescription>
                Manage network infrastructure and devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search devices..."
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleAddDevice}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Device
                </Button>
              </div>
              {renderTable(deviceTable)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleAddUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
              {renderTable(userTable)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/database-management')({
  component: DatabaseManagement,
})