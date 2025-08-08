import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import BusinessLicenses from "./pages/BusinessLicenses";
import CommunityHub from "./pages/CommunityHub";
import Auth from "./pages/Auth";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/program/:programId" element={<ProgramDetail />} />
                                 <Route path="/business-licenses" element={<BusinessLicenses />} />
                   <Route path="/community" element={<CommunityHub />} />
                   <Route path="/auth" element={<Auth />} />
                   <Route path="/privacy" element={<Privacy />} />
                   <Route path="/terms" element={<Terms />} />
                   <Route path="/contact" element={<Contact />} />
                   {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                   <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
