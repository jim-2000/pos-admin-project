import { Helmet } from "react-helmet-async"
import { useParams, Link } from "react-router-dom"
import { products } from "@/data/mock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProductDetails() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)

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
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <Card className="elevated-card">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
