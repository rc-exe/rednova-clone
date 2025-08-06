import { CreateCommunity } from "@/components/create/CreateCommunity";
import { Header } from "@/components/layout/Header";

export const CreateCommunityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CreateCommunity />
      </main>
    </div>
  );
};