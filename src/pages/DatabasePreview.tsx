import { Helmet } from "react-helmet-async"
import { useState, useEffect } from "react"
import { db } from "@/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DatabasePreview() {
  const [collections, setCollections] = useState<string[]>([])
  const [data, setData] = useState<Record<string, unknown[]>>({})
  const [activeTab, setActiveTab] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Get all collections
    const allCollections = db.getCollections()
    setCollections(allCollections)
    
    // Load data from all collections
    const allData: Record<string, unknown[]> = {}
    allCollections.forEach(collection => {
      allData[collection] = db.getAll(collection)
    })
    setData(allData)
    
    // Set active tab to first collection if available
    if (allCollections.length > 0 && !activeTab) {
      setActiveTab(allCollections[0])
    }
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      const updatedCollections = db.getCollections()
      setCollections(updatedCollections)
      
      const updatedData: Record<string, unknown[]> = {}
      updatedCollections.forEach(collection => {
        updatedData[collection] = db.getAll(collection)
      })
      setData(updatedData)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleStorageChange)
    }
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadAsJson = (collectionName: string, collectionData: unknown[]) => {
    const dataStr = JSON.stringify(collectionData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFileDefaultName = `${collectionName}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const downloadAllAsJson = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFileDefaultName = `database-export-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <>
      <Helmet>
        <title>Database Preview • POS Admin</title>
        <meta name="description" content="View all localStorage data as JSON" />
        <link rel="canonical" href="/database" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Database Preview</h1>
        <Button onClick={downloadAllAsJson} disabled={collections.length === 0}>
          Download All as JSON
        </Button>
      </div>
      
      {collections.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Data</CardTitle>
            <CardDescription>No collections found in localStorage database.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {collections.map(collection => (
              <TabsTrigger key={collection} value={collection}>
                {collection}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {collections.map(collection => (
            <TabsContent key={collection} value={collection}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{collection}</CardTitle>
                    <CardDescription>
                      {data[collection]?.length || 0} items
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(JSON.stringify(data[collection], null, 2))}
                    >
                      {copied ? 'Copied!' : 'Copy JSON'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadAsJson(collection, data[collection])}
                    >
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-xs">
                    {JSON.stringify(data[collection], null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </>
  )
}