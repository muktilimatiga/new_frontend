import { useMutation, useQuery } from '@tanstack/react-query'
import { getLexxadataCustomerScraperAPI } from './lexxadata'
import { useOpenTicketAPI } from './open-ticket'
import { searchOrGetAllCustomers } from './db-data-fiber'
import type { CustomerInDB } from './db-data-fiber'
import type {
  CustomerOnuDetail,
  OnuRxRespons,
  OnuStateRespons,
  RebootRequest,
  RebootResponse
} from './lexxadata'

// Export specific types and functions to avoid conflicts
export { apiClient } from './apiClient'
export type { 
  StartTerminalResponse, 
  CLIInstance, 
  CLIStatus, 
  StopResponse 
} from './cli'
export type { 
  ConfigurationRequest,
  ConfigurationResponse,
  ConfigurationSummary,
  CustomerInfo,
  OptionsResponse,
  UnconfiguredOnt
} from './config'
export type { 
  CustomerInDB,
  CustomerCreate,
  CustomerUpdate
} from './db-data-fiber'
export type {
  OpenTicketRequest,
  OpenTicketRequestPriority,
  OpenTicketRequestJenis,
  OpenTicketRequestHeadless,
  ProcessTicketRequest,
  TicketClosePayload,
  ForwardTicketPayload
} from './open-ticket'

// Hook for searching customers
export const useSearchCustomers = (
  params: { query?: string },
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['searchCustomers', params.query],
    queryFn: () => searchOrGetAllCustomers(params.query),
    enabled: options?.enabled !== false && !!params.query,
  })
}

// Hook for ONU actions - now using Orval-generated API
export const useExecuteOnuAction = (options?: {
  mutation?: {
    onSuccess?: (data: any, variables: any) => void
    onError?: (error: any, variables: any) => void
  }
}) => {
  const api = getLexxadataCustomerScraperAPI()
  
  return useMutation({
    mutationFn: async (payload: { userPppoe: string; action: string }) => {
      console.log('[DEBUG API] Executing ONU action:', payload)
      
      try {
        switch (payload.action) {
          case 'cek': {
            // Get detailed ONU information
            const response = await api.getCustomerAndOltDetailsApiV1OnuDetailSearchGet({
              q: payload.userPppoe
            })
            return {
              data: {
                telnet_output: formatOnuDetailResponse(response.data)
              }
            };
          }
          
          case 'check_full_port': {
            // Get ONU state information
            const response = await api.getCustomerAndStateApiV1OnuOnuStateGet({
              q: payload.userPppoe
            })
            return {
              data: {
                telnet_output: response.data.onu_state_data
              }
            };
          }
          
          case 'reboot_user': {
            // Reboot ONU
            const response = await api.rebootOnuByPppoeApiV1OnuRebootOnuPost({
              user_pppoe: parseInt(payload.userPppoe)
            })
            return {
              data: {
                telnet_output: response.data.status
              }
            };
          }
          
          default:
            throw new Error(`Unknown action: ${payload.action}`);
        }
      } catch (error) {
        console.error('[DEBUG API] ONU action error:', error)
        throw error;
      }
    },
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  })
}

// Helper function to format ONU detail response as CLI output
function formatOnuDetailResponse(data: CustomerOnuDetail): string {
  const lines = [
    `=== ONU Details ===`,
    `Type: ${data.type || 'N/A'}`,
    `Phase State: ${data.phase_state || 'N/A'}`,
    `Serial Number: ${data.serial_number || 'N/A'}`,
    `ONU Distance: ${data.onu_distance || 'N/A'}`,
    `Online Duration: ${data.online_duration || 'N/A'}`,
    `Attenuation: ${data.redaman || 'N/A'}`,
    `Remote IP: ${data.ip_remote || 'N/A'}`,
    '',
    `=== Ethernet Ports ===`,
    ...(data.eth_port?.map((port, index) =>
      `Port ${index + 1}: ${port.is_unlocked ? 'Unlocked' : 'Locked'}`
    ) || ['No port data available']),
    '',
    `=== Modem Logs ===`,
    data.modem_logs || 'No logs available'
  ];
  
  return lines.join('\n');
}

// Hook for opening and processing tickets
export const useOpenAndProcessTicket = (options?: {
  mutation?: {
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
  }
}) => {
  const ticketAPI = useOpenTicketAPI()
  return ticketAPI.useOpenAndProcessTicket(options)
}

// Function to fetch invoices (placeholder - needs implementation)
export const fetchInvoices = async (userPppoe: string) => {
  // This is a placeholder implementation
  // You'll need to implement the actual invoice fetching API call
  console.log('[DEBUG API] Fetching invoices for:', userPppoe)
  const mockData = [
    {
      period: '2024-01',
      status: 'unpaid',
      package: 'Internet Package',
      amount: 150000,
      description: 'Monthly internet subscription',
      payment_link: 'https://example.com/pay'
    }
  ];
  console.log('[DEBUG API] Returning mock invoice data:', mockData);
  return mockData;
}

// Export type for ONU action payload
export type OnuActionPayload = {
  userPppoe: string
  action: string
}

// Export InvoiceItem type (placeholder)
export type InvoiceItem = {
  period: string
  status: string
  package: string
  amount: number
  description: string
  payment_link?: string
}

// Export OnuResponse type (using CustomerInDB as base)
export type OnuResponse = CustomerInDB