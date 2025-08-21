import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfilePage } from "./ProfilePage";

export const ProfilePageLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <ProfilePage />
        </main>
      </div>
    </div>
  );
};