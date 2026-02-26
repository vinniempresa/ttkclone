import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { CartProvider } from "@/contexts/CartContext";
import { CartModal } from "@/components/CartModal";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CheckoutPage from "@/pages/CheckoutPage";
import InformativoPage from "@/pages/InformativoPage";
import PaymentPage from "@/pages/PaymentPage";
import NotFound from "@/pages/not-found";

let isPopState = false;
window.addEventListener('popstate', () => {
  isPopState = true;
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    if (isPopState) {
      isPopState = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/product/:id" component={ProductPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/informativo" component={InformativoPage} />
        <Route path="/pagamento" component={PaymentPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  return (
    <>
      <Router />
      <CartModal />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <CurrencyProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <AppContent />
            </TooltipProvider>
          </CartProvider>
        </CurrencyProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;
