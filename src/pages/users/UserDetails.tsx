import { Helmet } from "react-helmet-async"
import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { db } from "@/services"
import { User } from "@/services/localStorage/models"

export default function UserDetails() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Load user from localStorage
    if (id) {
      const userFromStorage = db.getById<User>('users', id)
      setUser(userFromStorage)
      setLoading(false)
    }
    
    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes('users') && id) {
        const updatedUser = db.getById<User>('users', id)
        setUser(updatedUser)
      }
    }
    
    // Custom event for same-window updates
    const handleCustomStorageChange = () => {
      if (id) {
        const updatedUser = db.getById<User>('users', id)
        setUser(updatedUser)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleCustomStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleCustomStorageChange)
    }
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-3">User Not Found</h1>
        <Button asChild>
          <Link to="/users/all">Back to Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{user.name} • User Details</title>
        <meta name="description" content={`Details for user ${user.name}`} />
        <link rel="canonical" href={`/users/${user.id}`} />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <Card className="elevated-card">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Role</div>
              <div className="font-medium">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="font-medium">{user.isActive ? 'Active' : 'Inactive'}</div>
            </div>
            {user.lastLogin && (
              <div>
                <div className="text-sm text-muted-foreground">Last Login</div>
                <div className="font-medium">{new Date(user.lastLogin).toLocaleString()}</div>
              </div>
            )}
            {user.createdAt && (
              <div>
                <div className="text-sm text-muted-foreground">Created At</div>
                <div className="font-medium">{new Date(user.createdAt).toLocaleString()}</div>
              </div>
            )}
            {user.updatedAt && (
              <div>
                <div className="text-sm text-muted-foreground">Updated At</div>
                <div className="font-medium">{new Date(user.updatedAt).toLocaleString()}</div>
              </div>
            )}
          </div>
          <div className="flex space-x-2 mt-4">
            <Button asChild variant="outline">
              <Link to="/users/all">Back to Users</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}