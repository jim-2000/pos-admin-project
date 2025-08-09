import { Helmet } from "react-helmet-async"
import { payments } from "@/data/mock"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PaymentHistory() {
  return (
    <>
      <Helmet>
        <title>Payment History • POS Admin</title>
        <meta name="description" content="All payment records in the POS system." />
        <link rel="canonical" href="/payments/history" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">All Payment History</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>${p.amount.toFixed(2)}</TableCell>
              <TableCell className="uppercase">{p.method}</TableCell>
              <TableCell>{p.reference}</TableCell>
              <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
