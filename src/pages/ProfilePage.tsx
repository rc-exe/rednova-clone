import { UserProfile } from "@/components/user/UserProfile";
import { mockUser } from "@/data/mockData";

export const ProfilePage = () => {
  return (
    <div className="container mx-auto py-6">
      <UserProfile user={mockUser} />
    </div>
  );
};