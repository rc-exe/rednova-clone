import { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, Globe, Database, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { MessageCenter } from "@/components/messages/MessageCenter";

export const SettingsPage = () => {
  const { user } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  
  const { notifications, createNotification } = useNotifications();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    comment_notifications: true,
    mention_notifications: true,
    language: "en",
    nsfw_content: false,
    autoplay_media: true,
    show_online_status: true
  });

  const handleProfileSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      await updateProfile(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Store preferences in localStorage for now
      localStorage.setItem('user-preferences', JSON.stringify(preferences));
      
      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully."
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    await createNotification({
      type: "system",
      title: "Test Notification",
      message: "This is a test notification to demo the notification system!",
      is_read: false,
    });
    
    toast({
      title: "Test notification sent!",
      description: "Check your notifications to see it."
    });
  };

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('user-preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowMessages(true)}
            >
              <User className="h-4 w-4 mr-2" />
              Messages
            </Button>
            
            <Button
              variant="outline"
              onClick={handleTestNotification}
            >
              Test Notification
            </Button>
          </div>
        </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading profile...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile?.username || ""}
                        onChange={(e) => updateProfile({ username: e.target.value })}
                        placeholder="Your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile?.display_name || ""}
                        onChange={(e) => updateProfile({ display_name: e.target.value })}
                        placeholder="Your display name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile?.bio || ""}
                      onChange={(e) => updateProfile({ bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profile?.website || ""}
                        onChange={(e) => updateProfile({ website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile?.location || ""}
                        onChange={(e) => updateProfile({ location: e.target.value })}
                        placeholder="Your location"
                      />
                    </div>
                  </div>
                </>
              )}

              <Button onClick={handleProfileSave} disabled={loading || profileLoading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, email_notifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={preferences.push_notifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, push_notifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Comment Replies</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone replies to your comments
                  </p>
                </div>
                <Switch
                  checked={preferences.comment_notifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, comment_notifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone mentions you
                  </p>
                </div>
                <Switch
                  checked={preferences.mention_notifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, mention_notifications: checked }))
                  }
                />
              </div>

              <Button onClick={handlePreferencesSave} disabled={loading}>
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others see when you're online
                  </p>
                </div>
                <Switch
                  checked={preferences.show_online_status}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, show_online_status: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>NSFW Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Show content marked as not safe for work
                  </p>
                </div>
                <Switch
                  checked={preferences.nsfw_content}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, nsfw_content: checked }))
                  }
                />
              </div>

              <Button onClick={handlePreferencesSave} disabled={loading}>
                {loading ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Theme switching will be implemented in a future update.</p>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autoplay Media</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically play videos and GIFs
                  </p>
                </div>
                <Switch
                  checked={preferences.autoplay_media}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, autoplay_media: checked }))
                  }
                />
              </div>

              <Button onClick={handlePreferencesSave} disabled={loading}>
                {loading ? "Saving..." : "Save Appearance Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      <MessageCenter 
        isOpen={showMessages} 
        onClose={() => setShowMessages(false)} 
      />
    </>
  );
};