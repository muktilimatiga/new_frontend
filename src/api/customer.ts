// --- In your api/customerApi.ts file (or similar) ---
import { apiClient } from "./apiClient";

export interface CustomerInDB {
  name: string
  alamat: string
  olt_name: string
  onu_sn: string
  pppoe_password: string
  interface: string
  onu_id:string
  sheet:string
  paket:string
  user_pppoe: string
  updated_at:string
}

export type SearchCustomerParams = {
    q: string
}

const BASE = 'api/v1'

export const searchCustomerInDB = (
  params?: SearchCustomerParams,
): Promise<Array<CustomerInDB>> => {
  
  let url = `${BASE}/data_fiber/`

  if (params) {
    const queryString = new URLSearchParams(params).toString()
    url += `?${queryString}`
  }

  return apiClient.get<Array<CustomerInDB>>(url)
}