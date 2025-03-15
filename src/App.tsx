import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ApiUrlProvider } from "./contexts/ApiUrlContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Loans from "./pages/Loans";
import Calculator from "./pages/Calculator";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ApiUrlProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                  <Route path="/loans" element={<MainLayout><Loans /></MainLayout>} />
                  <Route path="/calculator" element={<MainLayout><Calculator /></MainLayout>} />
                  <Route path="/about" element={<MainLayout><About /></MainLayout>} />
                  <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
                  <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ApiUrlProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
