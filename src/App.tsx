import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { HomePage } from "./pages/HomePage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { SubredditPage } from "./pages/SubredditPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ExplorePage } from "./pages/ExplorePage";
import { AuthPage } from "./pages/AuthPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AllPage } from "./pages/AllPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/r/:subreddit" element={<SubredditPage />} />
          <Route path="/user/:username" element={<ProfilePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create-community" element={<CreateCommunityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/all" element={<AllPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
