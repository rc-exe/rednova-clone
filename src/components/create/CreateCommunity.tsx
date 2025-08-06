import { useState } from "react";
import { Users, Globe, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const CreateCommunity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isNsfw, setIsNsfw] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Technology",
    "Science",
    "Gaming",
    "Sports",
    "Art",
    "Music",
    "Movies",
    "Books",
    "Food",
    "Travel",
    "Lifestyle",
    "News",
    "Politics",
    "Business",
    "Education",
    "Health",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Format the name (remove spaces, convert to lowercase, add r/ prefix if not present)
      const formattedName = name.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/^r\//, '');

      const { data, error } = await supabase
        .from('subreddits')
        .insert({
          name: `r/${formattedName}`,
          display_name: displayName || `r/${formattedName}`,
          description,
          category: category || 'Other',
          is_nsfw: isNsfw,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join the creator to the community
      await supabase
        .from('subreddit_memberships')
        .insert({
          user_id: user.id,
          subreddit_id: data.id
        });

      toast({
        title: "Community created!",
        description: `${data.display_name} has been created successfully.`
      });

      navigate(`/r/${formattedName}`);
    } catch (error: any) {
      console.error('Error creating community:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Error",
          description: "A community with this name already exists.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create community. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Create a Community</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Community Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Community name</Label>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">r/</span>
                <Input
                  id="name"
                  placeholder="communityname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1"
                  required
                  pattern="[a-zA-Z0-9_]+"
                  title="Community name can only contain letters, numbers, and underscores"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Community names cannot be changed later
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name (optional)</Label>
              <Input
                id="displayName"
                placeholder="Community Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this community about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NSFW Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mature content (18+)</Label>
                <p className="text-sm text-muted-foreground">
                  This community contains adult content
                </p>
              </div>
              <Switch
                checked={isNsfw}
                onCheckedChange={setIsNsfw}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || loading}
                className="bg-reddit-orange hover:bg-reddit-orange/90"
              >
                {loading ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};