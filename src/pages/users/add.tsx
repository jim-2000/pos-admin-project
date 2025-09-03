import { Helmet } from "react-helmet-async"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { db, generateId, withTimestamps } from "@/services"
import { User } from "@/services/localStorage/models"

export default function AddUser() {
  const navigate = useNavigate();
  const roles = ["admin", "manager", "cashier"];
  
  interface UserForm {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }
  
  const [user, setUser] = useState<UserForm>({
    name: '',
    email: '',
    role: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState<Partial<UserForm>>({});
  
  const validateForm = () => {
    const newErrors: Partial<UserForm> = {};
  
    if (!user.name.trim()) {
      newErrors.name = 'User name is required';
    }
  
    if (!user.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!user.role) {
      newErrors.role = 'Role is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (field: keyof UserForm, value: string | boolean) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create a new user object
      const newUser: User = withTimestamps({
        id: generateId(),
        name: user.name,
        email: user.email,
        role: user.role as 'admin' | 'manager' | 'cashier',
        isActive: user.isActive,
        lastLogin: new Date().toISOString()
      });
      
      // Initialize users collection if it doesn't exist
      if (!db.getCollections().includes('users')) {
        db.createCollection('users');
      }
      
      // Add the user to localStorage
      db.insert('users', newUser);
      
      // Dispatch custom event for same-window updates
      window.dispatchEvent(new CustomEvent('localStorageChange'));
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new Event('storage'));
      
      // Navigate back to users list
      navigate('/users/all');
    }
  };

  return (
    <>
      <Helmet>
        <title>Add New User • POS Admin</title>
        <meta name="description" content="Add a new user to the POS system." />
        <link rel="canonical" href="/users/add" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>

      <form onSubmit={handleSubmit} className="flex justify-center items-center min-h-[80vh]">
        <div className="grid gap-6 max-w-xl w-full bg-white p-8 rounded-xl shadow-lg">
          <div className="space-y-3">
            <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
            <Input 
              id="name"
              value={user.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter user's full name"
              className="w-full transition duration-200 hover:border-primary/80 focus:border-primary"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
            <Input 
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className="w-full transition duration-200 hover:border-primary/80 focus:border-primary"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div className="space-y-3">
            <label htmlFor="role" className="text-sm font-semibold text-gray-700">Role</label>
            <Select 
              value={user.role} 
              onValueChange={(value) => handleInputChange('role', value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={user.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active User
            </label>
          </div>

          <Button 
            type="submit"
            className="w-full mt-6 bg-primary hover:bg-primary/90 transition duration-200 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg"
          >
            Add User
          </Button>
        </div>
      </form>
    </>
  )
}