import { useState } from "react";
import { Search, TrendingUp, Users, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubredditCard } from "@/components/subreddit/SubredditCard";
import { mockSubreddits } from "@/data/mockData";

export const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("members");

  const filteredSubreddits = mockSubreddits.filter(subreddit =>
    subreddit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subreddit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subreddit.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSubreddits = [...filteredSubreddits].sort((a, b) => {
    switch (sortBy) {
      case "members":
        return b.members - a.members;
      case "activity":
        return b.activeMembers - a.activeMembers;
      case "new":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const categories = ["All", "Technology", "Programming", "Design", "Gaming", "Science", "Sports"];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Explore Communities</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover amazing communities and connect with people who share your interests
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-lg h-12"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {searchQuery ? `Results for "${searchQuery}"` : "Popular Communities"}
        </h2>
        
        <Tabs value={sortBy} onValueChange={setSortBy}>
          <TabsList>
            <TabsTrigger value="members" className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Newest</span>
            </TabsTrigger>
            <TabsTrigger value="name">A-Z</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSubreddits.map((subreddit) => (
          <SubredditCard key={subreddit.name} subreddit={subreddit} />
        ))}
      </div>

      {/* No Results */}
      {filteredSubreddits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No communities found matching your search.
          </p>
          <Button className="mt-4 bg-reddit-orange hover:bg-reddit-orange/90">
            Create Community
          </Button>
        </div>
      )}

      {/* Load More */}
      {filteredSubreddits.length > 0 && (
        <div className="text-center py-8">
          <Button variant="outline" size="lg">
            Load More Communities
          </Button>
        </div>
      )}
    </div>
  );
};