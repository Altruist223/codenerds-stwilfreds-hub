import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Members from "./pages/Members";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import JoinApplication from "./pages/JoinApplication";
import NotFound from "./pages/NotFound";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Custom error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <Alert variant="destructive" className="max-w-2xl">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Application Error</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>Sorry, something went wrong. Please try again or contact support if the problem persists.</p>
        <details className="text-sm">
          <summary className="cursor-pointer font-medium">Error details</summary>
          <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
            {error.message}
          </pre>
        </details>
        <div className="mt-4">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </AlertDescription>
    </Alert>
  </div>
);

// Define the fallback component as a separate variable
const AppErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
);

const App = () => (
  <ErrorBoundary
    fallback={<AppErrorFallback error={new Error('An error occurred')} resetErrorBoundary={() => window.location.reload()} />}
    onError={(error, errorInfo) => {
      // You can log errors to an error reporting service here
      console.error('App error boundary caught an error:', error, errorInfo);
    }}
  >
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/members" element={<Members />} />
            <Route path="/join" element={<JoinApplication />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary
                    fallback={(
                      <div className="p-4">
                        <ErrorFallback 
                          error={new Error('An error occurred in the admin panel')} 
                          resetErrorBoundary={() => window.location.reload()} 
                        />
                      </div>
                    )}
                  >
                    <Admin />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
