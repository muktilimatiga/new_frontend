import { createFileRoute } from '@tanstack/react-router'
import { Activity, AlertCircle, CheckCircle, Clock, Minus, TrendingDown, TrendingUp} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardMetrics } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


// Mock data for demonstration
const mockMetrics: DashboardMetrics = {
  weeklyTicketStats: {
    total: 47,
    resolved: 32,
    pending: 15,
    trend: 'up',
    trendPercentage: 12.5,
  },
  openTickets: [
    {
      id: '1',
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
      id: '2',
      customerId: 'cust-002',
      title: 'Router configuration needed',
      status: 'open',
      priority: 'medium',
      assignedTo: 'tech-002',
      createdAt: new Date('2024-01-15T09:15:00'),
      updatedAt: new Date('2024-01-15T11:45:00'),
      dueDate: new Date('2024-01-17T09:15:00'),
    },
    {
      id: '3',
      customerId: 'cust-003',
      title: 'Network outage in downtown area',
      status: 'open',
      priority: 'critical',
      assignedTo: 'tech-001',
      createdAt: new Date('2024-01-15T08:00:00'),
      updatedAt: new Date('2024-01-15T12:30:00'),
      dueDate: new Date('2024-01-15T16:00:00'),
    },
  ],
  performanceMetrics: {
    averageResolutionTime: 4.2,
    slaCompliance: 94.5,
    ticketsHandledToday: 12,
    customerSatisfaction: 4.3,
  },
  dailyTicketVolume: [
    { date: 'Mon', count: 8 },
    { date: 'Tue', count: 12 },
    { date: 'Wed', count: 6 },
    { date: 'Thu', count: 9 },
    { date: 'Fri', count: 7 },
    { date: 'Sat', count: 3 },
    { date: 'Sun', count: 2 },
  ],
  ticketStatusDistribution: [
    { status: 'Open', count: 15, color: '#ef4444' },
    { status: 'In Progress', count: 8, color: '#f59e0b' },
    { status: 'Resolved', count: 32, color: '#10b981' },
    { status: 'Closed', count: 12, color: '#6b7280' },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'ticket_created',
      description: 'New ticket created for customer cust-004',
      timestamp: new Date('2024-01-15T13:45:00'),
      userId: 'user-001',
    },
    {
      id: '2',
      type: 'ticket_resolved',
      description: 'Ticket #123 resolved successfully',
      timestamp: new Date('2024-01-15T12:30:00'),
      userId: 'tech-002',
    },
    {
      id: '3',
      type: 'device_added',
      description: 'New router added to network topology',
      timestamp: new Date('2024-01-15T11:15:00'),
      userId: 'admin-001',
    },
  ],
}

function Dashboard() {
  const { weeklyTicketStats, openTickets, performanceMetrics, dailyTicketVolume, ticketStatusDistribution, recentActivity } = mockMetrics

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>New Ticket</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets This Week</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyTicketStats.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(weeklyTicketStats.trend)}
              <span className="ml-1">{weeklyTicketStats.trendPercentage}% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyTicketStats.resolved}</div>
            <div className="text-xs text-muted-foreground">
              {Math.round((weeklyTicketStats.resolved / weeklyTicketStats.total) * 100)}% resolution rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyTicketStats.pending}</div>
            <div className="text-xs text-muted-foreground">
              {weeklyTicketStats.pending > 10 ? 'Requires attention' : 'Within normal range'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.averageResolutionTime}h</div>
            <div className="text-xs text-muted-foreground">
              {performanceMetrics.averageResolutionTime < 5 ? 'Good performance' : 'Needs improvement'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Ticket Volume</CardTitle>
            <CardDescription>Number of tickets handled each day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyTicketVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Status Distribution</CardTitle>
            <CardDescription>Current status of all tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {ticketStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Open Tickets and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Open Tickets Requiring Attention</CardTitle>
            <CardDescription>Tickets that need immediate action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{ticket.title}</h4>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer: {ticket.customerId} | Assigned to: {ticket.assignedTo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {ticket.dueDate?.toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleString()} by {activity.userId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})