import { Helmet } from "react-helmet-async"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function NewPayment() {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<string>("")
  const [reference, setReference] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !method) {
      toast({ title: "Missing fields", description: "Please fill amount and method." })
      return
    }
    toast({ title: "Payment recorded", description: `$${Number(amount).toFixed(2)} via ${method.toUpperCase()}` })
    setAmount(""); setMethod(""); setReference("")
  }

  return (
    <>
      <Helmet>
        <title>New Payment • POS Admin</title>
        <meta name="description" content="Create a new payment record in the POS system." />
        <link rel="canonical" href="/payments/new" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">New Payment</h1>
      <form onSubmit={onSubmit} className="max-w-md space-y-3">
        <div>
          <label className="text-sm text-muted-foreground">Amount</label>
          <Input type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Method</label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Reference</label>
          <Input value={reference} onChange={e=>setReference(e.target.value)} placeholder="#REF" />
        </div>
        <Button type="submit" variant="hero">Save Payment</Button>
      </form>
    </>
  )
}
