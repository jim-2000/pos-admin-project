import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initializeDatabase } from "@/services";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ActiveUsers from "./pages/users/ActiveUsers";
import AllUsers from "./pages/users/AllUsers";
import UserDetails from "./pages/users/UserDetails";
import AddUser from "./pages/users/add";
import ProductsList from "./pages/products/ProductsList";
import ProductDetails from "./pages/products/ProductDetails";
import AddProduct from "./pages/products/add";
import EditProduct from "./pages/products/edit";
import NewPayment from "./pages/payments/NewPayment";
import PaymentHistory from "./pages/payments/PaymentHistory";
import POSPage from "./pages/pos/POSPage";
import POSHistory from "./pages/pos/POSHistory";
import NotFound from "./pages/NotFound";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

// Initialize localStorage database
const initializeLocalStorage = () => {
  initializeDatabase();
};

// Call initialization function
initializeLocalStorage();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users/active" element={<ActiveUsers />} />
              <Route path="users/all" element={<AllUsers />} />
              <Route path="users/add" element={<AddUser />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="payments/new" element={<NewPayment />} />
              <Route path="payments/history" element={<PaymentHistory />} />
              <Route path="pos" element={<POSPage />} />
              <Route path="pos/history" element={<POSHistory />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
