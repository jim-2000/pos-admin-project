import { Helmet } from "react-helmet-async"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { db, initializeUsers } from "@/services"
import { User } from "@/services/localStorage/models"
import { Link } from "react-router-dom"

export default function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  
  useEffect(() => {
    // Initialize users if needed
    initializeUsers()
    
    // Load active users from localStorage
    const loadActiveUsers = () => {
      const storedUsers = db.getAll<User>('users')
      setActiveUsers(storedUsers.filter(u => u.isActive))
    }
    
    // Load initial data
    loadActiveUsers()
    
    // Listen for storage events to update the list when changes occur
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null || e.key.includes('users')) {
        loadActiveUsers()
      }
    }
    
    // Custom event for same-window updates
    const handleCustomStorageChange = () => loadActiveUsers()
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleCustomStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleCustomStorageChange)
    }
  }, [])
  return (
    <>
      <Helmet>
        <title>Active Users • POS Admin</title>
        <meta name="description" content="List of active users for the POS system." />
        <link rel="canonical" href="/users/active" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Active Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeUsers.map(u => (
            <TableRow key={u.id}>
              <TableCell>
                <Link to={`/users/${u.id}`} className="text-primary hover:underline">
                  {u.name}
                </Link>
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell className="text-primary">active</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
