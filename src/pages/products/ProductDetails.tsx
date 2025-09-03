import { Helmet } from "react-helmet-async"
import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { db } from "@/services"
import { Product } from "@/services/localStorage/models"

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Load product from localStorage
    if (id) {
      const productFromStorage = db.getById<Product>('products', id)
      setProduct(productFromStorage)
      setLoading(false)
    }
    
    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes('products') && id) {
        const updatedProduct = db.getById<Product>('products', id)
        setProduct(updatedProduct)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!product) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-3">Product Not Found</h1>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{product.name} • Product Details</title>
        <meta name="description" content={`Details for product ${product.name}`} />
        <link rel="canonical" href={`/products/${product.id}`} />
      </Helmet>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <Button asChild variant="outline">
          <Link to={`/products/edit/${product.id}`}>Edit Product</Link>
        </Button>
      </div>
      <Card className="elevated-card">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {product.description && (
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="font-medium">{product.description}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="font-medium">{product.category}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="font-medium">${product.price.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Stock</div>
              <div className="font-medium">{product.stock}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
