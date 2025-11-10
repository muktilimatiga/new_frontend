import { getLexxadataCustomerScraperAPI } from './lexxadata'
import type { 
  OpenTicketRequest as GeneratedOpenTicketRequest,
  ProcessTicketRequest as GeneratedProcessTicketRequest,
  ForwardTicketPayload, // Orval named this 'ForwardTicketPayload'
  TicketClosePayload    // Orval named this 'TicketClosePayload'
} from './lexxadata'

export type { 
  GeneratedOpenTicketRequest as OpenTicketRequest,
  GeneratedProcessTicketRequest as ProcessTicketRequest,
  ForwardTicketPayload as ForwardTicket,
  TicketClosePayload as CloseTicket
}

const {
  openAndProcessTicketApiV1TicketPost,
  processTicketApiV1TicketProsesTicketPost,
  forwardTicketEndpointApiV1TicketForwardTicketPost,
  closeTicketApiV1TicketCloseTicketPost
} = getLexxadataCustomerScraperAPI()



export const openTicket = async (request: GeneratedOpenTicketRequest) => {
  const response = await openAndProcessTicketApiV1TicketPost(request)
  return response.data
}

export const processTicket = async (request: GeneratedProcessTicketRequest) => {
  const response = await processTicketApiV1TicketProsesTicketPost(request)
  return response.data
}

export const forwardTicket = async (request: ForwardTicketPayload) => {
  const response = await forwardTicketEndpointApiV1TicketForwardTicketPost(request)
  return response.data
}

export const closeTicket = async (request: TicketClosePayload) => {
  const response = await closeTicketApiV1TicketCloseTicketPost(request)
  return response.data
}