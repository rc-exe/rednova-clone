import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SubredditPage } from "./SubredditPage";

export const SubredditPageLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <div className="container mx-auto px-4 py-8">
            <SubredditPage />
          </div>
        </main>
      </div>
    </div>
  );
};