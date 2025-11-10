import { useMutation, useQuery } from '@tanstack/react-query'
import {
  searchOrGetAllCustomers,
  getCustomerOnuDetail,
  getCustomerOnuState,
  rebootCustomerOnu,
  getCustomerInvoices,
} from './customer'
import { openTicket, processTicket } from './open-ticket'

export type {
  OptionsResponse,
  UnconfiguredOnt,
  ConfigurationRequest,
  ConfigurationResponse,
  CustomerInfo,
} from './config'

export type { CustomerInDB, CustomerOnuDetail, InvoiceItem } from './customer'

export type {
  OpenTicketRequest,
  ProcessTicketRequest,
  TicketClosePayload,
  ForwardTicketPayload,
} from './open-ticket'

export const useSearchCustomers = (
  params: { query?: string },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['searchCustomers', params.query],
    queryFn: () => searchOrGetAllCustomers(params.query),
    enabled: options?.enabled !== false && !!params.query,
  })
}
export const useExecuteOnuAction = (options?: {
  mutation?: {
    onSuccess?: (data: any, variables: any) => void
    onError?: (error: any, variables: any) => void
  }
}) => {
  return useMutation({
    mutationFn: async (payload: { userPppoe: string; action: string }) => {
      switch (payload.action) {
        case 'cek': {
          const response = await getCustomerOnuDetail(payload.userPppoe)
          return {
            data: {
              telnet_output: formatOnuDetailResponse(response),
            },
          }
        }
        case 'check_full_port': {
          const response = await getCustomerOnuState(payload.userPppoe)
          return {
            data: {
              telnet_output: response.onu_state_data,
            },
          }
        }
        case 'reboot_user': {
          const response = await rebootCustomerOnu({
            user_pppoe: parseInt(payload.userPppoe),
          })
          return {
            data: {
              telnet_output: response.status,
            },
          }
        }
        default:
          throw new Error(`Unknown action: ${payload.action}`)
      }
    },
    onSuccess: options?.mutation?.onSuccess,
    onError: options?.mutation?.onError,
  })
}

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
    ...(data.eth_port?.map(
      (port, index) =>
        `Port ${index + 1}: ${port.is_unlocked ? 'Unlocked' : 'Locked'}`,
    ) || ['No port data available']),
    '',
    `=== Modem Logs ===`,
    data.modem_logs || 'No logs available',
  ]

  return lines.join('\n')
}

export const useOpenAndProcessTicket = () => {
  return useMutation({
    // This assumes `openTicket` is the function for *both*
    // If 'process_immediately' is true
    mutationFn: openTicket,
  })
}

export const useFetchInvoices = (
  userPppoe: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['invoices', userPppoe],
    queryFn: () => getCustomerInvoices(userPppoe),
    enabled: options?.enabled !== false && !!userPppoe,
  })
}

export type OnuActionPayload = {
  userPppoe: string
  action: string
}