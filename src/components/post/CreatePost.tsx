import { useState } from "react";
import { Plus, Image, Link2, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [postType, setPostType] = useState("text");

  const communities = [
    "r/reactjs",
    "r/webdev", 
    "r/programming",
    "r/javascript",
    "r/Frontend",
    "r/webdesign"
  ];

  const handleSubmit = () => {
    console.log("Creating post:", { title, content, selectedCommunity, postType });
    // Here you would handle the post creation
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
          <label className="text-sm font-medium">Choose a community</label>
          <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
            <SelectTrigger>
              <SelectValue placeholder="Select a community" />
            </SelectTrigger>
            <SelectContent>
              {communities.map((community) => (
                <SelectItem key={community} value={community}>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${community}`} />
                      <AvatarFallback>{community[2]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{community}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="An interesting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Text (optional)</label>
              <Textarea
                placeholder="What are your thoughts?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Image</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Drag and drop images or click to browse</p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                placeholder="https://example.com"
                type="url"
              />
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Video</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Drag and drop videos or click to browse</p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={handleSubmit} disabled={!title || !selectedCommunity}>
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};