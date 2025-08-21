import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { HomePage } from "./pages/HomePage";
import { PostDetailPageLayout } from "./pages/PostDetailPageLayout";
import { SubredditPageLayout } from "./pages/SubredditPageLayout";
import { ProfilePageLayout } from "./pages/ProfilePageLayout";
import { ExplorePageLayout } from "./pages/ExplorePageLayout";
import { AuthPage } from "./pages/AuthPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CreatePostPageLayout } from "./pages/CreatePostPageLayout";
import { SettingsPage } from "./pages/SettingsPage";
import { AllPageLayout } from "./pages/AllPageLayout";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          {/* Protected Routes - require authentication */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute><PostDetailPageLayout /></ProtectedRoute>} />
          <Route path="/r/:subreddit" element={<ProtectedRoute><SubredditPageLayout /></ProtectedRoute>} />
          <Route path="/user/:username" element={<ProtectedRoute><ProfilePageLayout /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePageLayout /></ProtectedRoute>} />
          <Route path="/create-community" element={<ProtectedRoute><CreateCommunityPage /></ProtectedRoute>} />
          <Route path="/submit" element={<ProtectedRoute><CreatePostPageLayout /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/all" element={<ProtectedRoute><AllPageLayout /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-reddit-orange"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

export default App;
