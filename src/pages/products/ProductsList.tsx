import { Helmet } from "react-helmet-async"
import { products } from "@/data/mock"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function ProductsList() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<string | undefined>(undefined)
  const categories = Array.from(new Set(products.map(p => p.category)))
  const filtered = useMemo(() => products.filter(p =>
    (p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())) &&
    (!cat || p.category === cat)
  ), [q, cat])

  return (
    <>
      <Helmet>
        <title>Products • POS Admin</title>
        <meta name="description" content="Browse and filter all products in the POS catalog." />
        <link rel="canonical" href="/products" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Input placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)} />
        <Select onValueChange={(v)=>setCat(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="soft" onClick={()=>{ setQ(""); setCat(undefined) }}>Reset filters</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>${p.price.toFixed(2)}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm">
                  <Link to={`/products/${p.id}`}>Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
