// api/config.ts
// --- Import the generated types and functions ---
import { getLexxadataCustomerScraperAPI } from './lexxadata'
import type {
  OptionsResponse as GeneratedOptionsResponse,
  UnconfiguredOnt as GeneratedUnconfiguredOnt,
  CustomerInfo as GeneratedCustomerInfo,
  ConfigurationRequest as GeneratedConfigurationRequest,
  ConfigurationResponse as GeneratedConfigurationResponse,
  DataPSB as GeneratedDataPSB,
} from './lexxadata'

// --- Re-export the types for your app to use ---
export type {
  GeneratedOptionsResponse as OptionsResponse,
  GeneratedUnconfiguredOnt as UnconfiguredOnt,
  GeneratedCustomerInfo as CustomerInfo,
  GeneratedConfigurationRequest as ConfigurationRequest,
  GeneratedConfigurationResponse as ConfigurationResponse,
  GeneratedDataPSB as DataPSB,
}

// --- Get the API functions from Orval ---
const {
  getOptionsApiV1ConfigApiOptionsGet,
  detectUncfgOntsApiV1ConfigApiOltsOltNameDetectOntsGet,
  runConfigurationApiV1ConfigApiOltsOltNameConfigurePost,
  getPsbDataApiV1CustomerPsbGet,
} = getLexxadataCustomerScraperAPI()

// --- Create your clean wrapper functions ---

export async function getOptions(): Promise<GeneratedOptionsResponse> {
  const response = await getOptionsApiV1ConfigApiOptionsGet()
  return response.data
}

export async function detectUnconfiguredOnts(
  oltName: string,
): Promise<Array<GeneratedUnconfiguredOnt>> {
  const response =
    await detectUncfgOntsApiV1ConfigApiOltsOltNameDetectOntsGet(oltName)
  return response.data
}

export async function configureOnt(
  oltName: string,
  request: GeneratedConfigurationRequest,
): Promise<GeneratedConfigurationResponse> {
  const response = await runConfigurationApiV1ConfigApiOltsOltNameConfigurePost(
    oltName,
    request,
  )
  return response.data
}

export async function getPSBData(): Promise<Array<GeneratedDataPSB>> {
  const response = await getPsbDataApiV1CustomerPsbGet()
  return response.data
}
