import { Helmet } from "react-helmet-async"
import { users } from "@/data/mock"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"

export default function AllUsers() {
  const [q, setQ] = useState("")
  const filtered = useMemo(() => users.filter(u => (u.name+u.email).toLowerCase().includes(q.toLowerCase())), [q])

  return (
    <>
      <Helmet>
        <title>All Users • POS Admin</title>
        <meta name="description" content="All users registered in the POS system." />
        <link rel="canonical" href="/users/all" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
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
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
