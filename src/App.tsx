import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/context/RoleContext";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import RequestsList from "@/pages/RequestsList";
import SubmissionForm from "@/pages/SubmissionForm";
import ReviewApproval from "@/pages/ReviewApproval";
import SLADashboard from "@/pages/SLADashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <RoleProvider>
        <BrowserRouter>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <AppHeader />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<RequestsList />} />
                  <Route path="/submit" element={<SubmissionForm />} />
                  <Route path="/review" element={<ReviewApproval />} />
                  <Route path="/dashboard" element={<SLADashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
