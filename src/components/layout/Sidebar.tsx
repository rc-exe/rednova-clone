import { Home, TrendingUp, Users, BookOpen, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const popularSubreddits = [
    { name: "r/reactjs", members: "245k", icon: "💻" },
    { name: "r/webdev", members: "890k", icon: "🌐" },
    { name: "r/programming", members: "4.2M", icon: "⚡" },
    { name: "r/javascript", members: "2.1M", icon: "🚀" },
    { name: "r/css", members: "156k", icon: "🎨" },
  ];

  const mySubreddits = [
    { name: "r/Frontend", members: "67k", icon: "🎯" },
    { name: "r/webdesign", members: "234k", icon: "✨" },
    { name: "r/UIdesign", members: "89k", icon: "🎪" },
  ];

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 border-r bg-card">
      <ScrollArea className="h-full px-3 py-4">
        <div className="space-y-4">
          {/* Main Navigation */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/explore">
                <TrendingUp className="mr-2 h-4 w-4" />
                Popular
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/all">
                <Users className="mr-2 h-4 w-4" />
                All
              </Link>
            </Button>
          </div>

          <Separator />

          {/* Create Community */}
          <Button className="w-full" size="sm" asChild>
            <Link to="/create-community">
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Link>
          </Button>

          <Separator />

          {/* Popular Communities */}
          <div>
            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
              POPULAR COMMUNITIES
            </h3>
            <div className="space-y-1">
              {popularSubreddits.map((subreddit) => (
                <Button
                  key={subreddit.name}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2"
                  asChild
                >
                  <Link to={`/r/${subreddit.name.slice(2)}`}>
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                        {subreddit.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{subreddit.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {subreddit.members} members
                        </p>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* My Communities */}
          <div>
            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
              MY COMMUNITIES
            </h3>
            <div className="space-y-1">
              {mySubreddits.map((subreddit) => (
                <Button
                  key={subreddit.name}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2"
                  asChild
                >
                  <Link to={`/r/${subreddit.name.slice(2)}`}>
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-8 h-8 rounded-full bg-reddit-orange/10 flex items-center justify-center text-sm">
                        {subreddit.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{subreddit.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {subreddit.members} members
                        </p>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Footer Links */}
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};