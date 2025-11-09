import { apiClient } from './apiClient'

export interface OptionsResponse {
  olt_options: Array<string>
  modem_options: Array<string>
  package_options: Array<string>
}

export interface UnconfiguredOnt {
  sn: string
  pon_port: string
  pon_slot: string
}

export interface CustomerInfo {
  name: string
  address: string
  pppoe_user: string
  pppoe_pass: string
}

export interface ConfigurationRequest {
  sn: string
  customer: CustomerInfo
  modem_type: string
  package: string
  eth_locks: Array<boolean>
}

export interface ConfigurationSummary {
  serial_number: string
  slot: number
  port: number
  onu_id: number
  vlan: string
  customer_name: string
  customer_address: string
  modem_type: string
  package: string
  status: string
}

export interface ConfigurationResponse {
  message: string
  summary: ConfigurationSummary
  logs: Array<string>
}

export interface DataPSB {
  name: string
  address: string
  username: string
  password: string
  paket: string

}

const BASE = '/api/v1/config'

export async function getOptions(): Promise<OptionsResponse> {
  return apiClient.get<OptionsResponse>(`${BASE}/api/options`)
}

export async function detectUnconfiguredOnts(
  oltName: string,
): Promise<Array<UnconfiguredOnt>> {
  return apiClient.get<Array<UnconfiguredOnt>>(
    `${BASE}/api/olts/${oltName}/detect-onts`,
  )
}

export async function configureOnt(
  oltName: string,
  request: ConfigurationRequest,
): Promise<ConfigurationResponse> {
  return apiClient.post<ConfigurationResponse>(
    `${BASE}/api/olts/${oltName}/configure`,
    request,
  )
}

export async function getPSBData(): Promise<Array<DataPSB>> {
  return apiClient.get<Array<DataPSB>>(`/api/v1/customer/psb`)
}