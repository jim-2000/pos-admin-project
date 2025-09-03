import { Helmet } from "react-helmet-async"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { salesData, users, products, payments } from "@/data/mock"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, BarChart, Bar } from "recharts"

export default function Dashboard() {
  const totals = {
    sales: payments.reduce((sum, p) => sum + p.amount, 0),
    products: products.length,
    users: users.length,
    payments: payments.length,
  }

  return (
    <>
      <Helmet>
        <title>Dashboard • POS Admin</title>
        <meta name="description" content="Sales, products, payments, and users statistics in one dashboard." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>

      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-4">POS Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Overview of sales performance and operations.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Sales" value={`৳${totals.sales.toFixed(2)}`} subtitle="This week" />
          <StatCard title="Products" value={String(totals.products)} subtitle="In catalog" />
          <StatCard title="Payments" value={String(totals.payments)} subtitle="Recent" />
          <StatCard title="Users" value={String(totals.users)} subtitle="All users" />
        </div>
 

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 elevated-card">
            <CardHeader>
              <CardTitle>Payment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <li className="rounded-md border p-4">
                  <div className="text-sm text-muted-foreground">Card</div>
                  <div className="text-xl font-semibold">৳2,340</div>
                </li>
                <li className="rounded-md border p-4">
                  <div className="text-sm text-muted-foreground">Cash</div>
                  <div className="text-xl font-semibold">৳980</div>
                </li>
                <li className="rounded-md border p-4">
                  <div className="text-sm text-muted-foreground">UPI</div>
                  <div className="text-xl font-semibold">৳620</div>
                </li>
              </ul>
            </CardContent>
          </Card>
 
        </div>
      </section>
    </>
  )
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <Card className="elevated-card">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  )
}

function ChatBubble({ me, content }: { me?: boolean; content: string }) {
  return (
    <div className={`max-w-[85%] ${me ? 'ml-auto' : ''}`}>
      <div className={`rounded-lg px-3 py-2 ${me ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
        {content}
      </div>
    </div>
  )
}
