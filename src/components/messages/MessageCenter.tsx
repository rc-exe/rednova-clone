import { useState } from "react";
import { MessageCircle, Send, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
  from_username: string;
  to_username: string;
}

interface MessageCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageCenter = ({ isOpen, onClose }: MessageCenterProps) => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<"inbox" | "sent" | "compose">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    content: ""
  });

  // Mock messages for demo
  const mockMessages: Message[] = [
    {
      id: "1",
      from_user_id: "user2",
      to_user_id: user?.id || "",
      subject: "Welcome to the community!",
      content: "Hey there! I saw your post about React and wanted to welcome you to our community. Feel free to reach out if you have any questions!",
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      from_username: "moderator_mike",
      to_username: user?.email?.split('@')[0] || "user"
    },
    {
      id: "2",
      from_user_id: "user3",
      to_user_id: user?.id || "",
      subject: "Question about your TypeScript post",
      content: "Hi! I read your post about TypeScript best practices and had a follow-up question. Could you elaborate on the interface vs type aliases topic?",
      read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      from_username: "typescript_dev",
      to_username: user?.email?.split('@')[0] || "user"
    },
    {
      id: "3",
      from_user_id: "user4",
      to_user_id: user?.id || "",
      subject: "Collaboration opportunity",
      content: "Hello! I'm working on an open source project and think you'd be a great contributor based on your recent posts. Interested in learning more?",
      read: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      from_username: "opensource_sarah",
      to_username: user?.email?.split('@')[0] || "user"
    }
  ];

  const [messages] = useState<Message[]>(mockMessages);
  const unreadCount = messages.filter(m => !m.read).length;

  const filteredMessages = messages.filter(message => {
    if (selectedView === "sent") {
      return message.from_user_id === user?.id;
    }
    return message.to_user_id === user?.id;
  }).filter(message => {
    if (!searchQuery) return true;
    return message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
           message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
           message.from_username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSendMessage = () => {
    console.log("Sending message:", composeForm);
    // In a real app, this would send the message via API
    setComposeForm({ to: "", subject: "", content: "" });
    setSelectedView("inbox");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-8">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] bg-background border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Messages</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 h-[70vh]">
            {/* Left sidebar */}
            <div className="lg:w-1/3 space-y-4">
              {/* Navigation tabs */}
              <div className="flex space-x-2">
                <Button
                  variant={selectedView === "inbox" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("inbox")}
                >
                  Inbox ({unreadCount})
                </Button>
                <Button
                  variant={selectedView === "sent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("sent")}
                >
                  Sent
                </Button>
                <Button
                  variant={selectedView === "compose" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("compose")}
                >
                  Compose
                </Button>
              </div>

              {selectedView !== "compose" && (
                <>
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Messages list */}
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => setSelectedMessage(message)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedMessage?.id === message.id 
                              ? "bg-primary/10 border-primary/30" 
                              : message.read 
                                ? "bg-muted/30 hover:bg-muted/50" 
                                : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.from_username}`} />
                              <AvatarFallback>
                                {message.from_username[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">
                                  u/{message.from_username}
                                </p>
                                {!message.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm font-medium truncate">
                                {message.subject}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {message.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>

            <Separator orientation="vertical" className="hidden lg:block" />

            {/* Right content area */}
            <div className="lg:w-2/3">
              {selectedView === "compose" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Compose Message</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">To:</label>
                      <Input
                        placeholder="Username"
                        value={composeForm.to}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject:</label>
                      <Input
                        placeholder="Message subject"
                        value={composeForm.subject}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message:</label>
                      <Textarea
                        placeholder="Type your message here..."
                        value={composeForm.content}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={10}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!composeForm.to || !composeForm.subject || !composeForm.content}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedView("inbox")}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : selectedMessage ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedMessage.from_username}`} />
                      <AvatarFallback>
                        {selectedMessage.from_username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">u/{selectedMessage.from_username}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedMessage.subject}</h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setComposeForm(prev => ({
                        ...prev,
                        to: selectedMessage.from_username,
                        subject: `Re: ${selectedMessage.subject}`
                      }));
                      setSelectedView("compose");
                    }}
                  >
                    Reply
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a message to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};