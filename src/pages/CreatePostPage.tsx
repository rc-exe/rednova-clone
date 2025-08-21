import { CreatePost } from "@/components/post/CreatePost";

export const CreatePostPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create a Post</h1>
        <CreatePost />
      </div>
    </div>
  );
};