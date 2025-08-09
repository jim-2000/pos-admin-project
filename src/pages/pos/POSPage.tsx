import { Helmet } from "react-helmet-async"
import { useMemo, useState } from "react"
import { products, Product } from "@/data/mock"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function POSPage() {
  const [q, setQ] = useState("")
  const [cart, setCart] = useState<Record<string, number>>({})
  const [method, setMethod] = useState<string>("cash")

  const list = useMemo(() => products.filter(p => p.name.toLowerCase().includes(q.toLowerCase())), [q])
  const cartItems = Object.entries(cart).map(([id, qty]) => ({ product: products.find(p=>p.id===id)!, qty }))
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0)

  const add = (p: Product) => setCart(prev => ({ ...prev, [p.id]: (prev[p.id]||0)+1 }))
  const dec = (id: string) => setCart(prev => { const n = { ...prev }; if (!n[id]) return n; n[id] = n[id]-1; if (n[id]<=0) delete n[id]; return n })
  const clear = () => setCart({})

  const complete = () => {
    if (cartItems.length === 0) return toast({ title: "Empty cart", description: "Add products to cart." })
    toast({ title: "Payment completed", description: `$${subtotal.toFixed(2)} via ${method.toUpperCase()}` })
    clear()
  }

  return (
    <>
      <Helmet>
        <title>POS • Checkout</title>
        <meta name="description" content="Complete POS process: add products to cart and accept payment." />
        <link rel="canonical" href="/pos" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">POS</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2">
          <div className="mb-3">
            <Input placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {list.map(p => (
              <div key={p.id} className="border rounded-md p-3 elevated-card">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.category}</div>
                <div className="mt-2 text-primary font-semibold">${p.price.toFixed(2)}</div>
                <Button className="mt-3" onClick={()=>add(p)} variant="soft" size="sm">Add</Button>
              </div>
            ))}
          </div>
        </section>

        <aside className="border rounded-md p-4 h-fit sticky top-20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Cart</h2>
            <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
          </div>
          <div className="space-y-2 mb-4">
            {cartItems.length === 0 && (
              <div className="text-sm text-muted-foreground">No items added.</div>
            )}
            {cartItems.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">${product.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={()=>dec(product.id)}>-</Button>
                  <div className="w-6 text-center">{qty}</div>
                  <Button size="sm" variant="outline" onClick={()=>add(product)}>+</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="text-sm text-muted-foreground">Payment method</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" variant="hero" onClick={complete}>Complete Payment</Button>
        </aside>
      </div>
    </>
  )
}
