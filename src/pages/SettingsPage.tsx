import { SettingsPage as Settings } from "@/components/settings/SettingsPage";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <div className="container mx-auto px-4 py-8">
            <Settings />
          </div>
        </main>
      </div>
    </div>
  );
};