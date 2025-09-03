import { Helmet } from "react-helmet-async"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { db, withTimestamps } from "@/services"
import { Product } from "@/services/localStorage/models"

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<string[]>(["Accessories", "Power", "Displays", "Supplies", "Other"]);
  const [loading, setLoading] = useState(true);
  
  interface ProductForm {
    name: string;
    description: string;
    category: string;
    price: string;
    stock: string;
  }
  
  const [product, setProduct] = useState<ProductForm>({
    name: '',
    description: '',
    category: '',
    price: '0',
    stock: '0'
  });
  
  const [errors, setErrors] = useState<Partial<ProductForm>>({});

  useEffect(() => {
    // Load product from localStorage
    if (id) {
      const productFromStorage = db.getById<Product>('products', id);
      if (productFromStorage) {
        setProduct({
          name: productFromStorage.name,
          description: productFromStorage.description || '',
          category: productFromStorage.category,
          price: productFromStorage.price.toString(),
          stock: productFromStorage.stock.toString()
        });
      }
      setLoading(false);
    }
  }, [id]);
  
  const validateForm = () => {
    const newErrors: Partial<ProductForm> = {};
  
    if (!product.name.trim()) {
      newErrors.name = 'Product name is required';
    }
  
    if (!product.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    
    if (!product.category) {
      newErrors.category = 'Category is required';
    }
  
    const price = parseFloat(product.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
  
    const stock = parseInt(product.stock);
    if (isNaN(stock) || stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && id) {
      // Get the existing product to preserve fields we're not updating
      const existingProduct = db.getById<Product>('products', id);
      
      if (existingProduct) {
        // Update the product object
        const updatedProduct: Product = withTimestamps({
          ...existingProduct,
          name: product.name,
          description: product.description,
          category: product.category,
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
        }, true); // true to update the updatedAt timestamp
        
        // Update the product in localStorage
        db.update('products', id, updatedProduct);
        
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('localStorageChange'));
        
        // Navigate back to product details
        navigate(`/products/${id}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Edit Product • POS Admin</title>
        <meta name="description" content="Edit an existing product in the POS catalog." />
        <link rel="canonical" href={`/products/edit/${id}`} />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

        <form onSubmit={handleSubmit} className="flex justify-center items-center min-h-[80vh]">
          <div className="grid gap-6 max-w-xl w-full bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-3">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">Product Name</label>
              <Input 
                id="name"
                value={product.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                className="w-full transition duration-200 hover:border-primary/80 focus:border-primary"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700">Product Description</label>
              <Input 
                id="description"
                value={product.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                className="w-full transition duration-200 hover:border-primary/80 focus:border-primary"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            
            <div className="space-y-3">
              <label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</label>
              <Select 
                value={product.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="price" className="text-sm font-semibold text-gray-700">Price</label>
                <Input 
                  id="price"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full transition duration-200 hover:border-primary/80 focus:border-primary"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              <div className="space-y-3">
                <label htmlFor="stock" className="text-sm font-semibold text-gray-700">Stock</label>
                <Input 
                  id="stock"
                  type="number"
                  value={product.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                  className="w-full transition duration-200 hover:border-primary/80 focus:border-primary"
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full mt-6 bg-primary hover:bg-primary/90 transition duration-200 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </form>
    
    </>
  )
}