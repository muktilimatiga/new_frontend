import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { Download, Plus, Router, Server, Shield, Wifi, Zap } from 'lucide-react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import type { ConnectionMode, Node } from '@xyflow/react'
import type { TopologyEdge, TopologyNode } from '@/types'
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
const initialNodes: Array<TopologyNode> = [
  {
    id: 'router-1',
    type: 'router',
    position: { x: 250, y: 100 },
    data: {
      label: 'Core Router',
      status: 'online',
      deviceType: 'Router',
      ipAddress: '192.168.1.1',
      details: {
        model: 'Cisco ISR 4321',
        firmware: 'v15.2(2)S',
        uptime: '99.9%',
      },
    },
  },
  {
    id: 'switch-1',
    type: 'switch',
    position: { x: 400, y: 100 },
    data: {
      label: 'Distribution Switch',
      status: 'online',
      deviceType: 'Switch',
      ipAddress: '192.168.1.10',
      details: {
        model: 'Cisco Catalyst 2960',
        ports: 48,
        vlan: 'Enabled',
      },
    },
  },
  {
    id: 'firewall-1',
    type: 'firewall',
    position: { x: 550, y: 100 },
    data: {
      label: 'Firewall',
      status: 'online',
      deviceType: 'Firewall',
      ipAddress: '192.168.1.254',
      details: {
        model: 'Palo Alto PA-440',
        throughput: '10 Gbps',
        rules: '250+',
      },
    },
  },
  {
    id: 'server-1',
    type: 'server',
    position: { x: 700, y: 200 },
    data: {
      label: 'Application Server',
      status: 'online',
      deviceType: 'Server',
      ipAddress: '192.168.2.100',
      details: {
        model: 'Dell PowerEdge R740',
        cpu: 'Intel Xeon E5-2670',
        memory: '64GB DDR4',
        storage: '2TB RAID 10',
      },
    },
  },
  {
    id: 'ap-1',
    type: 'access-point',
    position: { x: 850, y: 200 },
    data: {
      label: 'Wireless AP',
      status: 'online',
      deviceType: 'Access Point',
      ipAddress: '192.168.3.50',
      details: {
        model: 'Ubiquiti UniFi AC Pro',
        clients: '127',
        frequency: '5 GHz',
      },
    },
  },
  {
    id: 'customer-1',
    type: 'customer',
    position: { x: 100, y: 300 },
    data: {
      label: 'Customer Site A',
      status: 'online',
      deviceType: 'Customer',
      details: {
        address: '123 Main St',
        service: 'Fiber 1Gbps',
        connection: 'Active',
      },
    },
  },
]

const initialEdges: Array<TopologyEdge> = [
  {
    id: 'edge-1',
    source: 'router-1',
    target: 'switch-1',
    type: 'default',
    data: {
      connectionType: 'Fiber',
      bandwidth: '10 Gbps',
      status: 'active',
    },
  },
  {
    id: 'edge-2',
    source: 'switch-1',
    target: 'firewall-1',
    type: 'default',
    data: {
      connectionType: 'Fiber',
      bandwidth: '10 Gbps',
      status: 'active',
    },
  },
  {
    id: 'edge-3',
    source: 'firewall-1',
    target: 'server-1',
    type: 'default',
    data: {
      connectionType: 'Fiber',
      bandwidth: '10 Gbps',
      status: 'active',
    },
  },
  {
    id: 'edge-4',
    source: 'server-1',
    target: 'ap-1',
    type: 'default',
    data: {
      connectionType: 'Ethernet',
      bandwidth: '1 Gbps',
      status: 'active',
    },
  },
  {
    id: 'edge-5',
    source: 'ap-1',
    target: 'customer-1',
    type: 'default',
    data: {
      connectionType: 'WiFi',
      bandwidth: '1 Gbps',
      status: 'active',
    },
  },
]

const nodeTypes = {
  router: { color: '#3b82f6', shape: 'diamond' },
  switch: { color: '#10b981', shape: 'rectangle' },
  firewall: { color: '#ef4444', shape: 'rectangle' },
  server: { color: '#8b5cf6', shape: 'rectangle' },
  'access-point': { color: '#06b6d4', shape: 'circle' },
  customer: { color: '#6366f1', shape: 'circle' },
}

const edgeTypes = {
  default: { stroke: '#94a3b8' },
  active: { stroke: '#10b981' },
  inactive: { stroke: '#6b7280' },
}

function NetworkTopology() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null)
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('default' as ConnectionMode)

  const onConnect = useCallback((params: any) => {
    const { source, target } = params
    const newEdge: TopologyEdge = {
      id: `edge-${Date.now()}`,
      source: source.id,
      target: target.id,
      type: connectionMode as unknown as TopologyEdge['type'],
      data: {
        connectionType: 'New Connection',
        bandwidth: '1 Gbps',
        status: 'active',
      },
    }
    setEdges((eds) => [...eds, newEdge])
  }, [connectionMode])

  const onNodeClick = useCallback((event: any, node: TopologyNode) => {
    setSelectedNode(node)
    console.log('Node clicked:', node.data)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#10b981'
      case 'offline':
        return '#ef4444'
      case 'maintenance':
        return '#f59e0b'
      case 'error':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'router':
        return <Router className="h-4 w-4" />
      case 'switch':
        return <Server className="h-4 w-4" />
      case 'firewall':
        return <Shield className="h-4 w-4" />
      case 'server':
        return <Server className="h-4 w-4" />
      case 'access-point':
        return <Wifi className="h-4 w-4" />
      case 'customer':
        return <Zap className="h-4 w-4" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  const handleExport = () => {
    console.log('Exporting topology data...')
    // In a real implementation, this would export the topology data
  }

  const handleAddDevice = () => {
    const newDevice: TopologyNode = {
      id: `device-${Date.now()}`,
      type: 'router',
      position: { x: Math.random() * 800 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: 'New Device',
        status: 'online',
        deviceType: 'Router',
        ipAddress: '192.168.1.100',
        details: {
          model: 'New Model',
          firmware: 'v1.0.0',
        },
      },
    }
    setNodes((nds) => [...nds, newDevice])
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Network Topology</h1>
        <div className="flex items-center space-x-2">
          <Select
            value={connectionMode}
            onValueChange={(value: string) => setConnectionMode(value as ConnectionMode)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Connection Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="straight">Straight</SelectItem>
              <SelectItem value="step">Step</SelectItem>
              <SelectItem value="smoothstep">Smooth Step</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddDevice}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Topology Canvas */}
      <Card>
        <CardHeader>
          <CardTitle>Network Diagram</CardTitle>
          <CardDescription>
            Interactive network topology visualization. Click on devices to view details.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ width: '100%', height: '600px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onConnect={onConnect}
              connectionMode={connectionMode}
              fitView
              defaultEdgeOptions={{
                animated: true,
              }}
            >
              <Background color="#f3f4f6" />
              <Controls />
              <MiniMap
                nodeStrokeColor="#374151"
                nodeColor="#1f2937"
                nodeBorderRadius={2}
              />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      {/* Device Details Panel */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle>Device Details</CardTitle>
            <CardDescription>
              Detailed information about the selected network device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Device Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">{selectedNode.data.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Type:</span>
                      <span className="text-sm">{selectedNode.data.deviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge
                        className={
                          selectedNode.data.status === 'online'
                            ? 'bg-green-500'
                            : selectedNode.data.status === 'offline'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }
                      >
                        {selectedNode.data.status}
                      </Badge>
                    </div>
                    {selectedNode.data.ipAddress && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">IP Address:</span>
                        <span className="text-sm">{selectedNode.data.ipAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Performance Metrics</h4>
                  <div className="space-y-2">
                    {selectedNode.data.details?.uptime && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Uptime:</span>
                        <span className="text-sm">{(selectedNode.data.details as any).uptime}</span>
                      </div>
                    )}
                    {selectedNode.data.details?.throughput && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Throughput:</span>
                        <span className="text-sm">{(selectedNode.data.details as any).throughput}</span>
                      </div>
                    )}
                    {selectedNode.data.details?.cpu && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">CPU:</span>
                        <span className="text-sm">{(selectedNode.data.details as any).cpu}</span>
                      </div>
                    )}
                    {selectedNode.data.details?.memory && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Memory:</span>
                        <span className="text-sm">{(selectedNode.data.details as any).memory}</span>
                      </div>
                    )}
                    {selectedNode.data.details?.storage && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Storage:</span>
                        <span className="text-sm">{(selectedNode.data.details as any).storage}</span>
                      </div>
                    )}
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

export const Route = createFileRoute('/network-topology')({
  component: NetworkTopology,
})