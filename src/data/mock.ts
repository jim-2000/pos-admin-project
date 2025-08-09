export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
}

export type User = {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
}

export type Payment = {
  id: string
  amount: number
  method: "cash" | "card" | "upi"
  reference?: string
  createdAt: string
}

export const products: Product[] = [
  { id: "p1", name: "Wireless Mouse", category: "Accessories", price: 29.99, stock: 42 },
  { id: "p2", name: "Mechanical Keyboard", category: "Accessories", price: 89.0, stock: 18 },
  { id: "p3", name: "USB‑C Charger 65W", category: "Power", price: 39.5, stock: 60 },
  { id: "p4", name: "27" + '"' + " 4K Monitor", category: "Displays", price: 329.0, stock: 8 },
  { id: "p5", name: "Thermal Receipt Rolls (10x)", category: "Supplies", price: 12.0, stock: 120 },
]

export const users: User[] = [
  { id: "u1", name: "Ava Carter", email: "ava@example.com", status: "active" },
  { id: "u2", name: "Noah Singh", email: "noah@example.com", status: "active" },
  { id: "u3", name: "Mia Chen", email: "mia@example.com", status: "inactive" },
  { id: "u4", name: "Liam Patel", email: "liam@example.com", status: "active" },
]

export const payments: Payment[] = [
  { id: "pay1", amount: 129.5, method: "card", reference: "#A12F4", createdAt: new Date().toISOString() },
  { id: "pay2", amount: 29.99, method: "cash", reference: "#A12F5", createdAt: new Date(Date.now()-86400000).toISOString() },
  { id: "pay3", amount: 59.0, method: "upi", reference: "#A12F6", createdAt: new Date(Date.now()-2*86400000).toISOString() },
]

export const salesData = Array.from({ length: 12 }).map((_, i) => ({
  month: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }),
  sales: Math.round(2000 + Math.random() * 4000),
  orders: Math.round(40 + Math.random() * 120),
  products: Math.round(20 + Math.random() * 60),
  users: Math.round(5 + Math.random() * 25),
}))
