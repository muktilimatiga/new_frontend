import type { Customer } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Import react-leaflet components directly at the top
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'

// Import Leaflet's CSS
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's default icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})


interface MapComponentProps {
  customers: Array<Customer>
  onCustomerClick: (customer: Customer) => void
  getServiceTypeColor: (serviceType: string) => string
}

export function MapComponent({ customers, onCustomerClick, getServiceTypeColor }: MapComponentProps) {
  // All the dynamic loading logic has been removed.
  // We just return the map JSX.

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {customers.map((customer) => (
          <Marker
            key={customer.id}
            position={[customer.location.coordinates[0], customer.location.coordinates[1]]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `
                <div style="
                  background-color: ${getServiceTypeColor(customer.serviceType)};
                  color: white;
                  border-radius: 50%;
                  width: 20px;
                  height: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 12px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                ">
                  ${customer.name.charAt(0)}
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
            eventHandlers={{
              click: () => onCustomerClick(customer),
            }}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <h3 className="font-semibold text-lg mb-2">{customer.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Service Type:</span>
                    <span className="text-sm">{customer.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      className={`ml-2 ${
                        customer.status === 'active'
                          ? 'bg-green-500'
                          : customer.status === 'inactive'
                          ? 'bg-gray-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Plan:</span>
                    <span className="text-sm">{customer.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Address:</span>
                    <span className="text-sm">{customer.location.address}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => console.log('View details', customer)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}