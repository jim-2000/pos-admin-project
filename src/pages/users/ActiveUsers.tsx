import { Helmet } from "react-helmet-async"
import { users } from "@/data/mock"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ActiveUsers() {
  const active = users.filter(u => u.status === 'active')
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
          {active.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell className="text-primary">{u.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
