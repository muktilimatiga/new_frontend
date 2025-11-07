import { createFileRoute } from '@tanstack/react-router'
import { Excalidraw, exportToSvg } from '@excalidraw/excalidraw'
import { useCallback, useState } from 'react'
import { Download, Save, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function NetworkTopology() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  const updateScene = useCallback(() => {
    if (!excalidrawAPI) return
    
    const sceneData = excalidrawAPI.getSceneElements()
    const appState = excalidrawAPI.getAppState()
    
    setData({
      elements: sceneData,
      appState: appState,
    })
  }, [excalidrawAPI])

  const handleExport = useCallback(async () => {
    if (!excalidrawAPI) return
    
    const elements = excalidrawAPI.getSceneElements()
    const appState = excalidrawAPI.getAppState()
    const files = excalidrawAPI.getFiles()
    
    try {
      const svg = await exportToSvg({
        elements,
        appState,
        files,
        exportPadding: 10,
      })
      
      if (svg) {
        const blob = new Blob([svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'network-topology.svg'
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export SVG:', error)
    }
  }, [excalidrawAPI])

  const handleClear = useCallback(() => {
    if (!excalidrawAPI) return
    excalidrawAPI.resetScene()
  }, [excalidrawAPI])

  const handleSave = useCallback(() => {
    if (!excalidrawAPI) return
    
    const sceneData = excalidrawAPI.getSceneElements()
    const appState = excalidrawAPI.getAppState()
    
    const serializedData = JSON.stringify({
      elements: sceneData,
      appState: appState,
    })
    
    const blob = new Blob([serializedData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'network-topology.excalidraw'
    link.click()
    URL.revokeObjectURL(url)
  }, [excalidrawAPI])

  const handleLoad = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.excalidraw'
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target?.result as string)
          if (excalidrawAPI && loadedData.elements) {
            excalidrawAPI.updateScene({
              elements: loadedData.elements,
              appState: loadedData.appState || {},
            })
          }
        } catch (error) {
          console.error('Failed to load file:', error)
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
  }, [excalidrawAPI])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Network Topology</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleLoad}>
            <Upload className="mr-2 h-4 w-4" />
            Load
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export SVG
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Diagram Canvas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[700px] w-full border rounded-lg overflow-hidden">
            <Excalidraw
              initialData={data}
              viewModeEnabled={false}
              zenModeEnabled={false}
              gridModeEnabled={true}
              theme="light"
              onPointerUpdate={() => updateScene()}
              excalidrawAPI={(api) => setExcalidrawAPI(api)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/network-topology')({
  ssr: false, // This will fix the "document is not defined" error
  component: NetworkTopology,
})