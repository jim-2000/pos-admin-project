import { Helmet } from "react-helmet-async"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { db, generateId, withTimestamps } from "@/services"
import { Product } from "@/services/localStorage/models"

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>(["Accessories", "Power", "Displays", "Supplies", "Other"]);
  
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
    
    if (validateForm()) {
      // Create a new product object
      const newProduct: Product = withTimestamps({
        id: generateId(),
        name: product.name,
        description: product.description,
        category: product.category,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        isActive: true
      });
      
      // Initialize products collection if it doesn't exist
      if (!db.getCollections().includes('products')) {
        db.createCollection('products');
      }
      
      // Add the product to localStorage
      db.insert('products', newProduct);
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new Event('storage'));
      
      // Navigate back to products list
      navigate('/products');
    }
  };

  return (
    <>
      <Helmet>
        <title>Add New Product • POS Admin</title>
        <meta name="description" content="Add a new product to the POS catalog." />
        <link rel="canonical" href="/products/add" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

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
              Add Product
            </Button>
          </div>
        </form>
    
    </>
  )
}
