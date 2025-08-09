import { useState } from "react";
import { Plus, Image, Link2, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useSubreddits } from "@/hooks/useSubreddits";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedSubreddit, setSelectedSubreddit] = useState("");
  const [flair, setFlair] = useState("");
  const [postType, setPostType] = useState("text");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { subreddits } = useSubreddits();

  const handleSubmit = async () => {
    if (!user || !title.trim() || !selectedSubreddit) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a community",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title: title.trim(),
        content: postType === "text" ? content : null,
        link_url: postType === "link" ? linkUrl : null,
        type: postType as "text" | "link" | "image" | "video",
        author_id: user.id,
        subreddit_id: selectedSubreddit,
        flair: flair || null,
      };

      const { error } = await supabase
        .from("posts")
        .insert(postData);

      if (error) throw error;

      toast({
        title: "Post created!",
        description: "Your post has been published successfully.",
      });

      // Reset form
      setTitle("");
      setContent("");
      setLinkUrl("");
      setSelectedSubreddit("");
      setFlair("");
      setPostType("text");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Post</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Community Selection */}
        <div className="space-y-2">
          <Label htmlFor="community">Choose a community</Label>
          <Select value={selectedSubreddit} onValueChange={setSelectedSubreddit}>
            <SelectTrigger>
              <SelectValue placeholder="Select a community" />
            </SelectTrigger>
            <SelectContent>
              {subreddits.map((subreddit) => (
                <SelectItem key={subreddit.id} value={subreddit.id}>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={subreddit.icon_url || `https://api.dicebear.com/7.x/initials/svg?seed=${subreddit.name}`} />
                      <AvatarFallback>{subreddit.name[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>r/{subreddit.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Flair (optional) */}
        <div className="space-y-2">
          <Label htmlFor="flair">Flair (optional)</Label>
          <Input
            id="flair"
            placeholder="Add a flair to your post"
            value={flair}
            onChange={(e) => setFlair(e.target.value)}
          />
        </div>

        {/* Post Type Tabs */}
        <Tabs value={postType} onValueChange={setPostType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="text" className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center space-x-1">
              <Image className="h-4 w-4" />
              <span>Image</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center space-x-1">
              <Link2 className="h-4 w-4" />
              <span>Link</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center space-x-1">
              <Video className="h-4 w-4" />
              <span>Video</span>
            </TabsTrigger>
          </TabsList>

          {/* Title Input */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="An interesting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
              required
            />
          </div>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Text (optional)</Label>
              <Textarea
                id="content"
                placeholder="What are your thoughts?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Image upload coming soon!</p>
                <p className="text-sm text-muted-foreground">For now, use link posts to share images</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link">URL *</Label>
              <Input
                id="link"
                placeholder="https://example.com"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required={postType === "link"}
              />
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Video</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Video upload coming soon!</p>
                <p className="text-sm text-muted-foreground">For now, use link posts to share videos</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" disabled={loading}>
            Save Draft
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!title || !selectedSubreddit || loading || (postType === "link" && !linkUrl)}
            className="bg-reddit-orange hover:bg-reddit-orange/90"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};