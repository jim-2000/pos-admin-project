import { Helmet } from "react-helmet-async"
import { useState, useEffect } from "react"
import { db } from "@/services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DatabaseSchema() {
  const [collections, setCollections] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>('schema')

  useEffect(() => {
    // Get all collections
    const allCollections = db.getCollections()
    setCollections(allCollections)
  }, [])

  // Define the database schema structure
  const dbSchema = {
    name: 'posAdminDb',
    version: 1,
    collections: [
      {
        name: 'products',
        description: 'Stores product information',
        fields: [
          { name: 'id', type: 'string', description: 'Unique identifier' },
          { name: 'name', type: 'string', description: 'Product name' },
          { name: 'description', type: 'string', description: 'Product description', optional: true },
          { name: 'price', type: 'number', description: 'Product price' },
          { name: 'category', type: 'string', description: 'Product category' },
          { name: 'stock', type: 'number', description: 'Available quantity' },
          { name: 'sku', type: 'string', description: 'Stock keeping unit', optional: true },
          { name: 'isActive', type: 'boolean', description: 'Whether product is active' },
          { name: 'createdAt', type: 'string', description: 'Creation timestamp' },
          { name: 'updatedAt', type: 'string', description: 'Last update timestamp' }
        ]
      },
      {
        name: 'users',
        description: 'Stores user information',
        fields: [
          { name: 'id', type: 'string', description: 'Unique identifier' },
          { name: 'name', type: 'string', description: 'User name' },
          { name: 'email', type: 'string', description: 'User email' },
          { name: 'role', type: 'string', description: 'User role (admin, manager, cashier)' },
          { name: 'isActive', type: 'boolean', description: 'Whether user is active' },
          { name: 'lastLogin', type: 'string', description: 'Last login timestamp', optional: true },
          { name: 'createdAt', type: 'string', description: 'Creation timestamp' },
          { name: 'updatedAt', type: 'string', description: 'Last update timestamp' }
        ]
      },
      {
        name: 'payments',
        description: 'Stores payment transactions',
        fields: [
          { name: 'id', type: 'string', description: 'Unique identifier' },
          { name: 'amount', type: 'number', description: 'Payment amount' },
          { name: 'method', type: 'string', description: 'Payment method (cash, card, mobile)' },
          { name: 'status', type: 'string', description: 'Payment status (pending, completed, failed)' },
          { name: 'customerId', type: 'string', description: 'Customer ID', optional: true },
          { name: 'items', type: 'array', description: 'Purchased items', subfields: [
            { name: 'productId', type: 'string', description: 'Product ID' },
            { name: 'quantity', type: 'number', description: 'Quantity purchased' },
            { name: 'price', type: 'number', description: 'Price per unit' }
          ]},
          { name: 'timestamp', type: 'string', description: 'Transaction timestamp' },
          { name: 'reference', type: 'string', description: 'Payment reference', optional: true },
          { name: 'createdAt', type: 'string', description: 'Creation timestamp' },
          { name: 'updatedAt', type: 'string', description: 'Last update timestamp' }
        ]
      },
      {
        name: 'categories',
        description: 'Stores product categories',
        fields: [
          { name: 'id', type: 'string', description: 'Unique identifier' },
          { name: 'name', type: 'string', description: 'Category name' },
          { name: 'description', type: 'string', description: 'Category description', optional: true },
          { name: 'parentId', type: 'string', description: 'Parent category ID', optional: true },
          { name: 'isActive', type: 'boolean', description: 'Whether category is active' },
          { name: 'createdAt', type: 'string', description: 'Creation timestamp' },
          { name: 'updatedAt', type: 'string', description: 'Last update timestamp' }
        ]
      },
      {
        name: 'settings',
        description: 'Stores application settings',
        fields: [
          { name: 'id', type: 'string', description: 'Unique identifier' },
          { name: 'storeName', type: 'string', description: 'Store name' },
          { name: 'address', type: 'string', description: 'Store address', optional: true },
          { name: 'phone', type: 'string', description: 'Store phone', optional: true },
          { name: 'email', type: 'string', description: 'Store email', optional: true },
          { name: 'currency', type: 'string', description: 'Store currency' },
          { name: 'taxRate', type: 'number', description: 'Tax rate percentage' },
          { name: 'theme', type: 'string', description: 'UI theme (light, dark, system)' },
          { name: 'createdAt', type: 'string', description: 'Creation timestamp' },
          { name: 'updatedAt', type: 'string', description: 'Last update timestamp' }
        ]
      }
    ]
  }

  // Render a collection schema
  const renderCollectionSchema = (collection: {
    name: string;
    description: string;
    fields: Array<{
      name: string;
      type: string;
      description: string;
      optional?: boolean;
      subfields?: Array<{
        name: string;
        type: string;
        description: string;
      }>;
    }>;
  }) => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{collection.name}</CardTitle>
          <CardDescription>{collection.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Field</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-left py-2 px-4">Required</th>
                  <th className="text-left py-2 px-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {collection.fields.map((field: { 
                  name: string;
                  type: string;
                  description: string;
                  optional?: boolean;
                  subfields?: Array<{
                    name: string;
                    type: string;
                    description: string;
                  }>;
                }, index: number) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4 font-medium">{field.name}</td>
                    <td className="py-2 px-4">
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">{field.type}</code>
                      {field.type === 'array' && field.subfields && (
                        <div className="mt-1 pl-4 border-l-2 text-xs">
                          {field.subfields.map((subfield: { name: string; type: string; description: string }, subIndex: number) => (
                            <div key={subIndex} className="mb-1">
                              <span className="font-medium">{subfield.name}</span>: <code className="bg-muted px-1 py-0.5 rounded">{subfield.type}</code>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {field.optional ? (
                        <span className="text-muted-foreground">No</span>
                      ) : (
                        <span className="text-primary">Yes</span>
                      )}
                    </td>
                    <td className="py-2 px-4">{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Helmet>
        <title>Database Schema • POS Admin</title>
        <meta name="description" content="View localStorage database schema and documentation" />
        <link rel="canonical" href="/database-schema" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Database Schema</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="schema">Schema</TabsTrigger>
          {/* <TabsTrigger value="documentation">Documentation</TabsTrigger> */}
          <TabsTrigger value="collections">Collections ({collections.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schema">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Database Overview</CardTitle>
              <CardDescription>
                The POS Admin application uses localStorage as a database to store and manage data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Database Information</h3>
                  <ul className="list-disc pl-6 mt-2">
                    <li><strong>Name:</strong> {dbSchema.name}</li>
                    <li><strong>Version:</strong> {dbSchema.version}</li>
                    <li><strong>Collections:</strong> {dbSchema.collections.length}</li>
                    <li><strong>Storage:</strong> Browser's localStorage</li>
                    <li><strong>Prefix:</strong> <code className="bg-muted px-1 py-0.5 rounded">{dbSchema.name}_v{dbSchema.version}</code></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {dbSchema.collections.map((collection, index) => (
            <div key={index}>
              {renderCollectionSchema(collection)}
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>LocalStorage Database Documentation</CardTitle>
              <CardDescription>
                How the localStorage database works in this application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Overview</h3>
                <p className="text-muted-foreground">
                  This application uses the browser's localStorage as a database to store and manage data.
                  The implementation provides a database-like interface with collections, CRUD operations,
                  and basic querying capabilities.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Key Concepts</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Collections:</strong> Similar to tables in a traditional database, collections store groups of related data.
                  </li>
                  <li>
                    <strong>Models:</strong> TypeScript interfaces that define the structure of data stored in collections.
                  </li>
                  <li>
                    <strong>Prefix:</strong> All localStorage keys are prefixed with <code className="bg-muted px-1 py-0.5 rounded">{dbSchema.name}_v{dbSchema.version}</code> to avoid conflicts.
                  </li>
                  <li>
                    <strong>Timestamps:</strong> All records include <code className="bg-muted px-1 py-0.5 rounded">createdAt</code> and <code className="bg-muted px-1 py-0.5 rounded">updatedAt</code> fields.
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Database Operations</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Collection Management</h4>
                    <ul className="list-disc pl-6">
                      <li><code className="bg-muted px-1 py-0.5 rounded">getCollections()</code>: Get all collections</li>
                      <li><code className="bg-muted px-1 py-0.5 rounded">createCollection(name)</code>: Create a new collection</li>
                      <li><code className="bg-muted px-1 py-0.5 rounded">dropCollection(name)</code>: Delete a collection</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">CRUD Operations</h4>
                    <ul className="list-disc pl-6">
                      <li><code className="bg-muted px-1 py-0.5 rounded">getAll(collection)</code>: Get all items from a collection</li>
                      <li><code className="bg-muted px-1 py-0.5 rounded">getById(collection, id)</code>: Get an item by ID</li>
                      <li><code className="bg-muted px-1 py-0.5 rounded">insert(collection, item)</code>: Add or update an item</li>
                      <li><code className="bg-muted px-1 py-0.5 rounded">update(collection, id, updates)</code>: Update an item</li>
                      <li><code className="bg-muted px-1 py-0.5 rounded">delete(collection, id)</code>: Delete an item</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Querying</h4>
                    <ul className="list-disc pl-6">
                      <li><code className="bg-muted px-1 py-0.5 rounded">find(collection, query)</code>: Find items matching a query function</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Limitations</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Storage Limit:</strong> localStorage is limited to about 5MB per domain.
                  </li>
                  <li>
                    <strong>No Indexing:</strong> Queries perform full collection scans.
                  </li>
                  <li>
                    <strong>No Transactions:</strong> Operations are not atomic.
                  </li>
                  <li>
                    <strong>Local Only:</strong> Data is stored in the browser and not shared between devices.
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Usage Example</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                  {`// Import the database service
import { db } from "@/services";

// Get all products
const products = db.getAll('products');

// Get a product by ID
const product = db.getById('products', 'product-123');

// Add a new product
db.insert('products', {
  id: 'product-456',
  name: 'New Product',
  price: 19.99,
  category: 'Electronics',
  stock: 10,
  isActive: true
});

// Update a product
db.update('products', 'product-456', { price: 24.99 });

// Delete a product
db.delete('products', 'product-456');

// Find products by category
const electronics = db.find('products', 
  product => product.category === 'Electronics'
);`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="collections">
          {collections.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Collections</CardTitle>
                <CardDescription>No collections found in localStorage database.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {collections.map((collection, index) => {
                const items = db.getAll(collection);
                const matchingSchema = dbSchema.collections.find(c => c.name === collection);
                
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{collection}</CardTitle>
                      <CardDescription>
                        {matchingSchema?.description || 'Collection'} • {items.length} items
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {items.length > 0 ? (
                        <div className="text-sm">
                          <p>Sample fields from first item:</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {Object.keys(items[0]).slice(0, 6).map((key, i) => (
                              <div key={i} className="flex">
                                <span className="font-medium mr-2">{key}:</span>
                                <span className="text-muted-foreground truncate">
                                  {typeof items[0][key] === 'object' 
                                    ? 'Object' 
                                    : String(items[0][key]).substring(0, 30)}
                                </span>
                              </div>
                            ))}
                            {Object.keys(items[0]).length > 6 && (
                              <div className="text-muted-foreground">+ {Object.keys(items[0]).length - 6} more fields</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">This collection is empty.</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}