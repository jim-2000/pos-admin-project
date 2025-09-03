import { Helmet } from "react-helmet-async"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useMemo, useState, useEffect } from "react"
import { db, initializeUsers } from "@/services"
import { User } from "@/services/localStorage/models"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function AllUsers() {
  const [q, setQ] = useState("")
  const [users, setUsers] = useState<User[]>([])
  
  useEffect(() => {
    // Initialize users if needed
    initializeUsers()
    
    // Load users from localStorage
    const loadUsers = () => {
      const storedUsers = db.getAll<User>('users')
      setUsers(storedUsers)
    }
    
    // Load initial data
    loadUsers()
    
    // Listen for storage events to update the list when changes occur
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null || e.key.includes('users')) {
        loadUsers()
      }
    }
    
    // Custom event for same-window updates
    const handleCustomStorageChange = () => loadUsers()
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleCustomStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleCustomStorageChange)
    }
  }, [])
  
  const filtered = useMemo(() => users.filter(u => (u.name+u.email).toLowerCase().includes(q.toLowerCase())), [q, users])

  return (
    <>
      <Helmet>
        <title>All Users • POS Admin</title>
        <meta name="description" content="All users registered in the POS system." />
        <link rel="canonical" href="/users/all" />
      </Helmet>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Users</h1>
        <Button asChild>
          <Link to="/users/add">Add User</Link>
        </Button>
      </div>
      <div className="mb-3">
        <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search users..." />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(u => (
            <TableRow key={u.id}>
              <TableCell>
                <Link to={`/users/${u.id}`} className="text-primary hover:underline">
                  {u.name}
                </Link>
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.isActive ? 'active' : 'inactive'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
