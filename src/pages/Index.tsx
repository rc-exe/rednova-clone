import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { HomePage } from "./HomePage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-reddit-orange"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
          {/* Reddit Logo */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 bg-reddit-orange rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">r</span>
            </div>
            <h1 className="text-6xl font-bold text-reddit-orange">reddit</h1>
          </div>
          
          {/* Welcome Text */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800">
              Welcome to the front page of the internet
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dive into anything. Join communities, share your thoughts, discover content,
              and connect with millions of people around the world.
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full max-w-md mx-auto h-12 text-lg font-semibold bg-reddit-orange hover:bg-reddit-orange-hover"
              asChild
            >
              <Link to="/auth">Get Started</Link>
            </Button>
            <p className="text-sm text-gray-500">
              Already have an account? <Link to="/auth" className="text-reddit-orange cursor-pointer hover:underline">Sign in</Link>
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-reddit-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-reddit-orange text-xl">💬</span>
              </div>
              <h3 className="font-semibold text-gray-800">Join Communities</h3>
              <p className="text-sm text-gray-600">Find your people in thousands of communities</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-reddit-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-reddit-orange text-xl">📝</span>
              </div>
              <h3 className="font-semibold text-gray-800">Share & Discuss</h3>
              <p className="text-sm text-gray-600">Post content and engage in conversations</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-reddit-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-reddit-orange text-xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-800">Discover</h3>
              <p className="text-sm text-gray-600">Explore trending topics and viral content</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <HomePage />
        </main>
      </div>
    </div>
  );
};

export default Index;
