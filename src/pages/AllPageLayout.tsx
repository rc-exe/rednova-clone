import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AllPage } from "./AllPage";

export const AllPageLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <AllPage />
        </main>
      </div>
    </div>
  );
};