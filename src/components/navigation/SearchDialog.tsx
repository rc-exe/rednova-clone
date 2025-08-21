import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SearchDialogProps {
  trigger: React.ReactNode;
}

export const SearchDialog = ({ trigger }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockResults = [
    {
      type: "subreddit",
      name: "r/reactjs",
      description: "A community for learning and developing React applications",
      members: "245k",
      icon: "💻",
    },
    {
      type: "post",
      title: "Just launched my new React app! What do you think?",
      author: "developer_mike",
      subreddit: "r/reactjs",
      upvotes: 245,
    },
    {
      type: "user",
      username: "developer_mike",
      displayName: "Mike Johnson",
      karma: "12.4k",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=developer_mike",
    },
  ];

  const filteredResults = mockResults.filter(result => {
    if (result.type === "subreddit") {
      return result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             result.description.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (result.type === "post") {
      return result.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (result.type === "user") {
      return result.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
             result.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Reddit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for communities, posts, and users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchQuery && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <div key={index} className="p-3 rounded-lg hover:bg-muted cursor-pointer">
                    {result.type === "subreddit" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          {result.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{result.name}</span>
                            <Badge variant="outline">Community</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.description}</p>
                          <p className="text-xs text-muted-foreground">{result.members} members</p>
                        </div>
                      </div>
                    )}
                    
                    {result.type === "post" && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Post</Badge>
                          <span className="text-sm text-muted-foreground">by u/{result.author} in {result.subreddit}</span>
                        </div>
                        <p className="font-medium">{result.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          <span>{result.upvotes} upvotes</span>
                        </div>
                      </div>
                    )}
                    
                    {result.type === "user" && (
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>{result.username[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">u/{result.username}</span>
                            <Badge variant="outline">User</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.displayName}</p>
                          <p className="text-xs text-muted-foreground">{result.karma} karma</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}

          {!searchQuery && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">TRENDING SEARCHES</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "JavaScript", "Web Development", "CSS", "TypeScript"].map((trend) => (
                  <Button key={trend} variant="outline" size="sm" onClick={() => setSearchQuery(trend)}>
                    {trend}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};