import { Helmet } from "react-helmet-async"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { db } from "@/services"
import { Payment, Product } from "@/services/localStorage/models"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function POSHistory() {
  const [transactions, setTransactions] = useState<Payment[]>([])
  const [products, setProducts] = useState<Record<string | number, Product>>({})
  
  useEffect(() => {
    // Initialize transactions collection if needed
    if (!db.getCollections().includes('transactions')) {
      db.createCollection('transactions');
    }
    
    // Load transactions from localStorage
    const loadTransactions = () => {
      const storedTransactions = db.getAll<Payment>('transactions');
      setTransactions(storedTransactions.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA; // Sort by newest first
      }));
      
      // Load all products for reference
      const storedProducts = db.getAll<Product>('products');
      const productsMap: Record<string | number, Product> = {};
      storedProducts.forEach(product => {
        productsMap[product.id] = product;
      });
      setProducts(productsMap);
    };
    
    // Load initial data
    loadTransactions();
    
    // Listen for storage events to update the list when changes occur
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null || e.key.includes('transactions')) {
        loadTransactions();
      }
    };
    
    // Custom event for same-window updates
    const handleCustomStorageChange = () => loadTransactions();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, []);

  const getProductName = (productId: string | number): string => {
    return products[productId]?.name || 'Unknown Product';
  };

  const downloadPDF = (transaction: Payment) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Transaction Receipt', 14, 22);
    
    // Add transaction details
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${transaction.id}`, 14, 32);
    doc.text(`Date: ${new Date(transaction.timestamp).toLocaleString()}`, 14, 38);
    doc.text(`Payment Method: ${transaction.method.toUpperCase()}`, 14, 44);
    doc.text(`Reference: ${transaction.reference || 'N/A'}`, 14, 50);
    
    // Add items table
    const tableColumn = ["Product", "Quantity", "Price", "Total"];
    const tableRows = transaction.items.map(item => [
      getProductName(item.productId),
      item.quantity.toString(),
      `৳${item.price.toFixed(2)}`,
      `৳${(item.quantity * item.price).toFixed(2)}`
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    // Add total
    const finalY = ((doc.internal.pages[1] as { lastAutoTable?: { finalY: number } })?.lastAutoTable?.finalY) || 120;
    doc.text(`Total Amount: ৳${transaction.amount.toFixed(2)}`, 14, finalY + 10);
    
    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 14, finalY + 20);
    
    // Save the PDF
    doc.save(`transaction-${transaction.id}.pdf`);
  };

  const downloadAllPDF = () => {
    if (transactions.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Transaction History', 14, 22);
    
    // Add date range
    doc.setFontSize(12);
    if (transactions.length > 0) {
      const oldestDate = new Date(transactions[transactions.length - 1].timestamp).toLocaleDateString();
      const newestDate = new Date(transactions[0].timestamp).toLocaleDateString();
      doc.text(`Period: ${oldestDate} - ${newestDate}`, 14, 30);
    }
    
    // Add transactions table
    const tableColumn = ["ID", "Date", "Amount", "Method", "Reference"];
    const tableRows = transactions.map(t => [
      t.id.toString().substring(0, 8) + '...',
      new Date(t.timestamp).toLocaleDateString(),
      `৳${t.amount.toFixed(2)}`,
      t.method.toUpperCase(),
      t.reference || 'N/A'
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    // Add total
    const finalY = ((doc.internal.pages[1] as { lastAutoTable?: { finalY: number } })?.lastAutoTable?.finalY) || 200;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    doc.text(`Total Sales: ৳${totalAmount.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Total Transactions: ${transactions.length}`, 14, finalY + 16);
    
    // Save the PDF
    doc.save(`transaction-history-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <>
      <Helmet>
        <title>POS History • POS Admin</title>
        <meta name="description" content="View and download transaction history from the POS system." />
        <link rel="canonical" href="/pos/history" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">POS Transaction History</h1>
        <Button onClick={downloadAllPDF} disabled={transactions.length === 0}>
          Download All as PDF
        </Button>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No transaction history found. Complete a transaction in the POS to see it here.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{String(transaction.id).substring(0, 8)}...</TableCell>
                <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                <TableCell>৳{transaction.amount.toFixed(2)}</TableCell>
                <TableCell className="uppercase">{transaction.method}</TableCell>
                <TableCell>{transaction.items.length} items</TableCell>
                <TableCell>{transaction.reference || 'N/A'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => downloadPDF(transaction)}>
                    Download Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}