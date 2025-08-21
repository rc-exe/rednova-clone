import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CreatePostPage } from "./CreatePostPage";

export const CreatePostPageLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <CreatePostPage />
        </main>
      </div>
    </div>
  );
};