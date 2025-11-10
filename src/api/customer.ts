// api/customer.ts
// --- Import the generated types and functions ---
import { getLexxadataCustomerScraperAPI } from './lexxadata'
import type {
  CustomerInDB as GeneratedCustomerInDB,
  CustomerOnuDetail as GeneratedCustomerOnuDetail,
  OnuStateRespons as GeneratedOnuStateRespons,
  RebootResponse as GeneratedRebootResponse,
  RebootRequest as GeneratedRebootRequest,
  CustomerwithInvoices as GeneratedCustomerwithInvoices,
  InvoiceItem as GeneratedInvoiceItem,
} from './lexxadata'

// --- Re-export the types ---
export type {
  GeneratedCustomerInDB as CustomerInDB,
  GeneratedCustomerOnuDetail as CustomerOnuDetail,
  GeneratedOnuStateRespons as OnuStateRespons,
  GeneratedRebootResponse as RebootResponse,
  GeneratedRebootRequest as RebootRequest,
  GeneratedCustomerwithInvoices as CustomerwithInvoices,
  GeneratedInvoiceItem as InvoiceItem,
}

// --- Get the API functions ---
const {
  searchOrGetAllCustomersApiV1DataFiberGet,
  getCustomerAndOltDetailsApiV1OnuDetailSearchGet,
  getCustomerAndStateApiV1OnuOnuStateGet,
  rebootOnuByPppoeApiV1OnuRebootOnuPost,
  getFastCustomerDetailsApiV1CustomerInvoicesGet,
} = getLexxadataCustomerScraperAPI()

// --- Create your clean wrapper functions ---

export const searchOrGetAllCustomers = async (
  query?: string,
): Promise<GeneratedCustomerInDB[]> => {
  const params = { q: query || undefined }
  const response = await searchOrGetAllCustomersApiV1DataFiberGet(params)
  return response.data
}

export const getCustomerOnuDetail = async (
  query: string,
): Promise<GeneratedCustomerOnuDetail> => {
  const response = await getCustomerAndOltDetailsApiV1OnuDetailSearchGet({
    q: query,
  })
  return response.data
}

export const getCustomerOnuState = async (
  query: string,
): Promise<GeneratedOnuStateRespons> => {
  const response = await getCustomerAndStateApiV1OnuOnuStateGet({ q: query })
  return response.data
}

export const rebootCustomerOnu = async (
  request: GeneratedRebootRequest,
): Promise<GeneratedRebootResponse> => {
  const response = await rebootOnuByPppoeApiV1OnuRebootOnuPost(request)
  return response.data
}

export const getCustomerInvoices = async (
  query: string,
): Promise<GeneratedCustomerwithInvoices[]> => {
  const response = await getFastCustomerDetailsApiV1CustomerInvoicesGet({
    query,
  })
  return response.data
}
