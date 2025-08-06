import { useState, useEffect, useRef } from "react";
import { Send, Search, MoreVertical, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

export const ChatPanel = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: "1",
        otherUser: {
          id: "user1",
          name: "JohnDev",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JohnDev",
          isOnline: true
        },
        lastMessage: {
          id: "msg1",
          content: "Hey, saw your post about React hooks!",
          senderId: "user1",
          senderName: "JohnDev",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          isRead: false
        },
        unreadCount: 2,
        messages: [
          {
            id: "msg1",
            content: "Hey, saw your post about React hooks!",
            senderId: "user1",
            senderName: "JohnDev",
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            isRead: false
          },
          {
            id: "msg2",
            content: "Really helpful explanation, thanks!",
            senderId: "user1",
            senderName: "JohnDev",
            timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
            isRead: false
          }
        ]
      },
      {
        id: "2",
        otherUser: {
          id: "user2",
          name: "ReactGuru",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ReactGuru",
          isOnline: false
        },
        lastMessage: {
          id: "msg3",
          content: "Thanks for the help with the component!",
          senderId: "user2",
          senderName: "ReactGuru",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true
        },
        unreadCount: 0,
        messages: [
          {
            id: "msg3",
            content: "Thanks for the help with the component!",
            senderId: "user2",
            senderName: "ReactGuru",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isRead: true
          }
        ]
      }
    ];
    setConversations(mockConversations);
  }, []);

  const selectedChat = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      senderId: user?.id || "current_user",
      senderName: user?.email?.split('@')[0] || "You",
      timestamp: new Date().toISOString(),
      isRead: true
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: newMessage
            }
          : conv
      )
    );

    setMessageInput("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Messages</h3>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.otherUser.avatar} />
                      <AvatarFallback>
                        {conversation.otherUser.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Circle
                      className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background ${
                        conversation.otherUser.isOnline 
                          ? 'fill-green-500 text-green-500' 
                          : 'fill-gray-400 text-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {conversation.otherUser.name}
                      </p>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedChat.otherUser.avatar} />
                    <AvatarFallback>
                      {selectedChat.otherUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Circle
                    className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background ${
                      selectedChat.otherUser.isOnline 
                        ? 'fill-green-500 text-green-500' 
                        : 'fill-gray-400 text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedChat.otherUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.otherUser.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-reddit-orange text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === user?.id
                            ? 'text-white/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  size="sm"
                  className="bg-reddit-orange hover:bg-reddit-orange/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Send className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};