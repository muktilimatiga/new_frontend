import React from 'react'
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Settings,
  Settings2,
} from 'lucide-react'
import type {
  UnconfiguredOnt,
  ConfigurationRequest,
  OptionsResponse,
  ConfigurationResponse,
  DataPSB,
} from '@/api/config'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { configureOnt, detectUnconfiguredOnts, getOptions, getPSBData } from '@/api/config'
import { useQuery, useMutation } from '@tanstack/react-query'

interface NewConfigProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const initialFormState = {
  modemType: '',
  ethLocks: [false, false, false, false],
}

export function NewConfig({
  children,
  open,
  onOpenChange,
}: NewConfigProps) {
  const [selectedOlt, setSelectedOlt] = React.useState<string>('')
  const [unconfiguredOnts, setUnconfiguredOnts] = React.useState<
    Array<UnconfiguredOnt>
  >([])
  const [selectedOnt, setSelectedOnt] = React.useState<UnconfiguredOnt | null>(
    null,
  )
  const [selectedData, setSelectData] = React.useState<DataPSB | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [logs, setLogs] = React.useState<Array<string>>([])
  const [formState, setFormState] = React.useState(initialFormState)
  const [isOpen, setIsOpen] = React.useState(open || false)

  const optionsQuery = useQuery<OptionsResponse, Error>({
    queryKey: ['configOptions'],
    queryFn: getOptions,
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
  })

  const detectOntsMutation = useMutation<Array<UnconfiguredOnt>, Error, string>({
    mutationFn: detectUnconfiguredOnts,
    onSuccess: (data) => {
      setUnconfiguredOnts(data)
      setSelectedOnt(null)
      if (data.length === 0) {
        setSuccess('No unconfigured ONTs found')
      } else {
        setSuccess(null)
      }
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const optionsDataQuery = useQuery<Array<DataPSB>, Error>({
    queryKey: ['psbData'],
    queryFn: getPSBData,
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
  })

  const configureOntMutation = useMutation<
    ConfigurationResponse,
    Error,
    {
      oltName: string
      request: ConfigurationRequest
    }
  >({
    mutationFn: (payload) => configureOnt(payload.oltName, payload.request),
    onSuccess: (data) => {
      setSuccess(data.message)
      setLogs(data.logs)
      setUnconfiguredOnts((prev) =>
        prev.filter((ont) => ont.sn !== selectedOnt?.sn),
      )
      setSelectedOnt(null)
      setFormState(initialFormState)
      setSelectData(null)
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)

    if (!newOpen) {
      resetState()
    }
  }

  const resetState = () => {
    setSelectedOlt('')
    setUnconfiguredOnts([])
    setSelectedOnt(null)
    setError(null)
    setSuccess(null)
    setLogs([])
    setFormState(initialFormState)
    setSelectData(null)
    detectOntsMutation.reset()
    configureOntMutation.reset()
  }

  const handleDetectOnts = () => {
    if (!selectedOlt) return
    setError(null)
    setSuccess(null)
    detectOntsMutation.mutate(selectedOlt)
  }

  const handleCustomerSelect = (customerUsername: string) => {
    const customer = optionsDataQuery.data?.find(
      (c) => c.username === customerUsername,
    )
    if (customer) {
      setSelectData(customer)
    } else {
      setSelectData(null)
    }
  }

  const handleConfigure = () => {
    if (!selectedOnt || !selectedOlt || !selectedData) {
      setError('Please select an OLT, ONT, and Customer')
      return
    }

    const { modemType, ethLocks } = formState

    if (!modemType) {
      setError('Please select a Modem Type')
      return
    }

    const request: ConfigurationRequest = {
      sn: selectedOnt.sn,
      customer: {
        name: selectedData.name,
        address: selectedData.address,
        pppoe_user: selectedData.username,
        pppoe_pass: selectedData.password,
      },
      modem_type: modemType,
      package: selectedData.paket, // <-- Use package from PSB data
      eth_locks: ethLocks,
    }

    setError(null)
    setSuccess(null)
    configureOntMutation.mutate({ oltName: selectedOlt, request })
  }

  const handleOntSelect = (ont: UnconfiguredOnt) => {
    setSelectedOnt(ont)
    setError(null)
    setSuccess(null)
    setLogs([])
  }

  const triggerButton = children || (
    <Button variant="outline" className="h-8">
      <Settings2 className="h-4 w-4 mr-2" />
      Configure ONT
    </Button>
  )

  const isLoading = optionsQuery.isLoading || optionsDataQuery.isLoading
  const isError = optionsQuery.isError || optionsDataQuery.isError
  const errorMessage =
    optionsQuery.error?.message || optionsDataQuery.error?.message

  // Helper component to display data
  const DataRow = ({ label, value }: { label: string; value?: string }) => (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="text-sm font-medium p-2 bg-muted rounded min-h-[32px]">
        {value || '...'}
      </div>
    </div>
  )

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            ONT Configuration
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-700 text-sm">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : isError ? (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="olt-select">Select OLT</Label>
                  <Select value={selectedOlt} onValueChange={setSelectedOlt}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an OLT" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionsQuery.data?.olt_options.map((olt) => (
                        <SelectItem key={olt} value={olt}>
                          {olt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleDetectOnts}
                  disabled={!selectedOlt || detectOntsMutation.isPending}
                  className="w-full h-8"
                >
                  {detectOntsMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Detect ONTs
                </Button>

                {unconfiguredOnts.length > 0 && (
                  <div>
                    <Label>Unconfigured ONTs ({unconfiguredOnts.length})</Label>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                      {unconfiguredOnts.map((ont) => (
                        <div
                          key={ont.sn}
                          className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                            selectedOnt?.sn === ont.sn
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleOntSelect(ont)}
                        >
                          <div className="font-medium">{ont.sn}</div>
                          <div className="text-xs text-muted-foreground">
                            Slot {ont.pon_slot}, Port {ont.pon_port}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {selectedOnt ? (
                  <>
                    <div className="p-3 bg-muted rounded text-sm">
                      <div className="font-medium">
                        Selected ONT: {selectedOnt.sn}
                      </div>
                      <div className="text-muted-foreground">
                        Slot {selectedOnt.pon_slot}, Port {selectedOnt.pon_port}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="psb-select" className="text-xs">
                        Select Customer (from PSB)
                      </Label>
                      <Select
                        value={selectedData?.username || ''}
                        onValueChange={handleCustomerSelect}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select PSB customer to auto-fill" />
                        </SelectTrigger>
                        <SelectContent>
                          {optionsDataQuery.data?.map((psb) => (
                            <SelectItem
                              key={psb.username}
                              value={psb.username || ''}
                            >
                              {psb.name} ({psb.username})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DataRow
                        label="Customer Name"
                        value={selectedData?.name}
                      />
                      <DataRow
                        label="PPPoE Username"
                        value={selectedData?.username}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DataRow
                        label="PPPoE Password"
                        value={selectedData?.password}
                      />
                      <DataRow
                        label="Package"
                        value={selectedData?.paket}
                      />
                    </div>

                    <DataRow
                      label="Customer Address"
                      value={selectedData?.address}
                    />

                    <div>
                      <Label htmlFor="modem-type" className="text-xs">
                        Modem Type *
                      </Label>
                      <Select
                        value={formState.modemType}
                        onValueChange={(value) =>
                          setFormState((prev) => ({
                            ...prev,
                            modemType: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select modem" />
                        </SelectTrigger>
                        <SelectContent>
                          {optionsQuery.data?.modem_options.map((modem) => (
                            <SelectItem key={modem} value={modem}>
                              {modem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Field orientation="horizontal">
                      <FieldLabel htmlFor="eth-lock">Lock Eth</FieldLabel>
                      <Switch id="ethlock" />
                    </Field>
                    </div>

                    <Button
                      onClick={handleConfigure}
                      disabled={configureOntMutation.isPending}
                      className="w-full h-8"
                    >
                      {configureOntMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Settings className="h-4 w-4 mr-2" />
                      )}
                      Configure ONT
                    </Button>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8 text-sm">
                    Select an OLT and detect ONTs, then choose an ONT to
                    configure
                  </div>
                )}
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div>
              <Label className="text-xs">Configuration Logs</Label>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-xs max-h-32 overflow-y-auto mt-1">
                {logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NewConfig