import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Save, X, Home, UserPlus, FileText, Settings, Lock, Loader2, CheckCircle } from "lucide-react";
import { Event, Member } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getJoinApplications, 
  getApprovedApplications,
  getPendingApplications,
  updateJoinApplicationStatus, 
  deleteJoinApplication,
  signOutUser,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  testFirebaseConnection
} from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { User, JoinApplication } from "@/lib/api";

const Admin = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [users, setUsers] = useState<User[]>([]);
  const [joinApplications, setJoinApplications] = useState<JoinApplication[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<JoinApplication[]>([]);
  const [pendingApplications, setPendingApplications] = useState<JoinApplication[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingApplication, setEditingApplication] = useState<JoinApplication | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard.",
      });
      navigate('/admin/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Test Firebase connection first
        console.log('Testing Firebase connection...');
        const connectionTest = await testFirebaseConnection();
        console.log('Connection test result:', connectionTest);
        
        if (!connectionTest.success) {
          toast({
            title: "Firebase Connection Error",
            description: "Unable to connect to Firebase. Please check your configuration.",
            variant: "destructive",
          });
          return;
        }
        
        await Promise.all([
          loadEvents(),
          loadMembers(),
          loadUsers(),
          loadJoinApplications()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);

  const loadUsers = async () => {
    const result = await getUsers();
    if (result.success) {
      setUsers(result.users as User[]);
    }
  };

  const loadEvents = async () => {
    console.log('Loading events...');
    const result = await getEvents();
    console.log('Events load result:', result);
    if (result.success) {
      setEvents(result.events as Event[]);
      console.log('Events set successfully:', result.events?.length);
    } else {
      console.error('Failed to load events:', result.error);
    }
  };

  const loadMembers = async () => {
    console.log('Loading members...');
    const result = await getMembers();
    console.log('Members load result:', result);
    if (result.success) {
      setMembers(result.members as Member[]);
      console.log('Members set successfully:', result.members?.length);
    } else {
      console.error('Failed to load members:', result.error);
    }
  };

  const loadJoinApplications = async () => {
    try {
      console.log('🔄 Loading join applications...');
      
      // Load all applications
      const allResult = await getJoinApplications();
      console.log('📋 All applications result:', allResult);
      if (allResult.success) {
        setJoinApplications(allResult.applications as JoinApplication[]);
        console.log('✅ All applications loaded:', allResult.applications?.length);
      } else {
        console.error('❌ Failed to load all applications:', allResult.error);
      }
      
      // Load approved applications
      const approvedResult = await getApprovedApplications();
      console.log('✅ Approved applications result:', approvedResult);
      if (approvedResult.success) {
        setApprovedApplications(approvedResult.applications as JoinApplication[]);
        console.log('✅ Approved applications loaded:', approvedResult.applications?.length);
      } else {
        console.error('❌ Failed to load approved applications:', approvedResult.error);
      }
      
      // Load pending applications
      const pendingResult = await getPendingApplications();
      console.log('⏳ Pending applications result:', pendingResult);
      if (pendingResult.success) {
        setPendingApplications(pendingResult.applications as JoinApplication[]);
        console.log('✅ Pending applications loaded:', pendingResult.applications?.length);
      } else {
        console.error('❌ Failed to load pending applications:', pendingResult.error);
      }
    } catch (error) {
      console.error('❌ Error loading join applications:', error);
    }
  };

  // Event management functions
  const addEvent = () => {
    const newEvent: Event = {
      id: "", // Let Firestore generate the ID
      title: "",
      description: "",
      frequency: "",
      time: "",
      location: "",
      tags: [],
      date: "",
      image: "",
      registrationLink: ""
    };
    setEditingEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  const editEvent = (event: Event) => {
    setEditingEvent({ ...event });
    setIsEventDialogOpen(true);
  };

  const deleteEventHandler = async (id: string) => {
    try {
      const result = await deleteEvent(id);
      if (result.success) {
        await loadEvents(); // Reload events from Firebase
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete event",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const saveEvent = async () => {
    console.log('Saving event...', editingEvent);
    if (!editingEvent) return;
    
    if (!editingEvent.title || !editingEvent.description) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingEvent.id && editingEvent.id !== "" && events.find(e => e.id === editingEvent.id)) {
        // Update existing event
        console.log('Updating existing event with ID:', editingEvent.id);
        const result = await updateEvent(editingEvent.id, editingEvent);
        console.log('Update result:', result);
        if (result.success) {
          await loadEvents(); // Reload events from Firebase
          setIsEventDialogOpen(false);
          setEditingEvent(null);
          toast({
            title: "Event updated",
            description: "The event has been successfully updated.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update event",
            variant: "destructive",
          });
        }
      } else {
        // Add new event
        console.log('Creating new event...');
        const result = await createEvent(editingEvent);
        console.log('Create result:', result);
        if (result.success) {
          await loadEvents(); // Reload events from Firebase
          setIsEventDialogOpen(false);
          setEditingEvent(null);
          toast({
            title: "Event created",
            description: "The event has been successfully created.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create event",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error in saveEvent:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  // Member management functions
  const addMember = () => {
    const newMember: Member = {
      id: "", // Let Firestore generate the ID
      name: "",
      role: "",
      department: "",
      year: "",
      skills: [],
      description: "",
      social: {}
    };
    setEditingMember(newMember);
    setIsMemberDialogOpen(true);
  };

  const editMember = (member: Member) => {
    setEditingMember({ ...member });
    setIsMemberDialogOpen(true);
  };

  const deleteMemberHandler = async (id: string) => {
    try {
      const result = await deleteMember(id);
      if (result.success) {
        await loadMembers(); // Reload members from Firebase
        toast({
          title: "Member deleted",
          description: "The member has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const saveMember = async () => {
    if (!editingMember) return;
    
    if (!editingMember.name || !editingMember.role) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingMember.id && editingMember.id !== "" && members.find(m => m.id === editingMember.id)) {
        // Update existing member
        console.log('Updating existing member with ID:', editingMember.id);
        const result = await updateMember(editingMember.id, editingMember);
        if (result.success) {
          await loadMembers(); // Reload members from Firebase
          setIsMemberDialogOpen(false);
          setEditingMember(null);
          toast({
            title: "Member updated",
            description: "The member has been successfully updated.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update member",
            variant: "destructive",
          });
        }
      } else {
        // Add new member
        const result = await createMember(editingMember);
        if (result.success) {
          await loadMembers(); // Reload members from Firebase
          setIsMemberDialogOpen(false);
          setEditingMember(null);
          toast({
            title: "Member created",
            description: "The member has been successfully created.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create member",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const addTag = (tags: string[], newTag: string, setTags: (tags: string[]) => void) => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
    }
  };

  const removeTag = (tags: string[], tagToRemove: string, setTags: (tags: string[]) => void) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addSkill = (skills: string[], newSkill: string, setSkills: (skills: string[]) => void) => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
  };

  const removeSkill = (skills: string[], skillToRemove: string, setSkills: (skills: string[]) => void) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="gradient-text">Admin</span> Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage events and members for Code Nerds
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Lock className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Button
              onClick={() => setActiveTab("events")}
              variant={activeTab === "events" ? "default" : "outline"}
              className="h-auto py-4 px-6 flex flex-col items-center gap-2"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-sm font-medium">Event Management</span>
            </Button>
            
            <Button
              onClick={() => setActiveTab("members")}
              variant={activeTab === "members" ? "default" : "outline"}
              className="h-auto py-4 px-6 flex flex-col items-center gap-2"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Member Management</span>
            </Button>
            
            <Button
              onClick={() => setActiveTab("users")}
              variant={activeTab === "users" ? "default" : "outline"}
              className="h-auto py-4 px-6 flex flex-col items-center gap-2"
            >
              <UserPlus className="w-6 h-6" />
              <span className="text-sm font-medium">User Management</span>
            </Button>
            
            <Button
              onClick={() => setActiveTab("applications")}
              variant={activeTab === "applications" ? "default" : "outline"}
              className="h-auto py-4 px-6 flex flex-col items-center gap-2"
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm font-medium">Join Applications</span>
            </Button>
            
            
          </div>
        </div>

                 {/* Loading State */}
         {loading && (
           <div className="flex items-center justify-center py-20">
             <div className="flex items-center gap-2">
               <Loader2 className="w-6 h-6 animate-spin" />
               <span className="text-lg">Loading data...</span>
             </div>
           </div>
         )}

         {/* Content Tabs */}
         {!loading && (
           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Applications
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Events</h2>
              <Button onClick={addEvent} className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>

            <div className="grid gap-6">
              {events.map((event) => (
                <Card key={event.id} className="tech-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {event.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteEventHandler(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{event.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{event.location}</span>
                      </div>
                                             {event.date && (
                         <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-accent" />
                           <span>{event.date}</span>
                         </div>
                       )}
                       {event.registrationLink && (
                         <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-accent" />
                           <a 
                             href={event.registrationLink} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 hover:underline"
                           >
                             Registration Link
                           </a>
                         </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Members</h2>
              <Button onClick={addMember} className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            <div className="grid gap-6">
              {members.map((member) => (
                <Card key={member.id} className="tech-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{member.name}</CardTitle>
                        <p className="text-accent font-medium mb-2">{member.role}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {member.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-secondary/50">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editMember(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMemberHandler(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{member.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Department:</span> {member.department}
                      </div>
                      <div>
                        <span className="font-medium">Year:</span> {member.year}
                      </div>
                      {member.social?.email && (
                        <div>
                          <span className="font-medium">Email:</span> {member.social.email}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Users</h2>
              <Button onClick={() => {
                setEditingUser({ id: '', email: '', role: 'member', status: 'active', createdAt: new Date().toISOString() });
                setIsUserDialogOpen(true);
              }} className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="grid gap-6">
              {users.map((user) => (
                <Card key={user.id} className="tech-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{user.email}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user);
                            setIsUserDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const result = await deleteUser(user.id);
                            if (result.success) {
                              toast({ title: "User deleted", description: "User deleted successfully" });
                              loadUsers();
                            } else {
                              toast({ title: "Error", description: result.error || "Failed to delete user", variant: "destructive" });
                            }
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      {user.lastLogin && (
                        <div>
                          <span className="font-medium">Last Login:</span> {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Join Applications</h2>
            </div>

            {/* Pending Applications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-amber-600 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Applications ({pendingApplications.length})
              </h3>
              <div className="grid gap-4">
                {pendingApplications.map((application) => (
                  <Card key={application.id} className="tech-border border-amber-200 bg-amber-50/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{application.firstName} {application.lastName}</CardTitle>
                          <p className="text-accent font-medium mb-2">{application.email}</p>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              Pending Review
                            </Badge>
                            <Badge variant="outline">{application.department}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingApplication(application);
                              setIsApplicationDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const result = await deleteJoinApplication(application.id);
                              if (result.success) {
                                toast({ title: "Application deleted", description: "Application deleted successfully" });
                                loadJoinApplications();
                              } else {
                                toast({ title: "Error", description: result.error || "Failed to delete application", variant: "destructive" });
                              }
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{application.motivation}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Student ID:</span> {application.studentId}
                        </div>
                        <div>
                          <span className="font-medium">Year:</span> {application.year}
                        </div>
                        <div>
                          <span className="font-medium">Skills:</span> {application.skills.slice(0, 3).join(', ')}
                          {application.skills.length > 3 && ` +${application.skills.length - 3} more`}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {new Date(application.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {pendingApplications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                    <p>No pending applications</p>
                  </div>
                )}
              </div>
            </div>

            {/* Approved Applications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Approved Applications ({approvedApplications.length})
              </h3>
              <div className="grid gap-4">
                {approvedApplications.map((application) => (
                  <Card key={application.id} className="tech-border border-green-200 bg-green-50/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{application.firstName} {application.lastName}</CardTitle>
                          <p className="text-accent font-medium mb-2">{application.email}</p>
                          <div className="flex gap-2">
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Approved ✅
                            </Badge>
                            <Badge variant="outline">{application.department}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingApplication(application);
                              setIsApplicationDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const result = await deleteJoinApplication(application.id);
                              if (result.success) {
                                toast({ title: "Application deleted", description: "Application deleted successfully" });
                                loadJoinApplications();
                              } else {
                                toast({ title: "Error", description: result.error || "Failed to delete application", variant: "destructive" });
                              }
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{application.motivation}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Student ID:</span> {application.studentId}
                        </div>
                        <div>
                          <span className="font-medium">Year:</span> {application.year}
                        </div>
                        <div>
                          <span className="font-medium">Skills:</span> {application.skills.slice(0, 3).join(', ')}
                          {application.skills.length > 3 && ` +${application.skills.length - 3} more`}
                        </div>
                        <div>
                          <span className="font-medium">Approved:</span> {new Date(application.reviewedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {approvedApplications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                    <p>No approved applications</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}

        {/* Event Dialog */}
                 <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle>
                 {editingEvent?.id && events.find(e => e.id === editingEvent.id) ? 'Edit Event' : 'Add New Event'}
               </DialogTitle>
               <DialogDescription>
                 {editingEvent?.id && events.find(e => e.id === editingEvent.id) 
                   ? 'Update the event details below.' 
                   : 'Fill in the details to create a new event.'}
               </DialogDescription>
             </DialogHeader>
            {editingEvent && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Title *</Label>
                  <Input
                    id="event-title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label htmlFor="event-description">Description *</Label>
                  <Textarea
                    id="event-description"
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-frequency">Frequency</Label>
                    <Input
                      id="event-frequency"
                      value={editingEvent.frequency}
                      onChange={(e) => setEditingEvent({ ...editingEvent, frequency: e.target.value })}
                      placeholder="e.g., Weekly, Monthly"
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      value={editingEvent.time}
                      onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                      placeholder="e.g., 2:00 PM - 5:00 PM"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      placeholder="e.g., Computer Lab 1"
                    />
                  </div>
                                     <div>
                     <Label htmlFor="event-date">Date</Label>
                     <Input
                       id="event-date"
                       type="date"
                       value={editingEvent.date || ''}
                       onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                     />
                   </div>
                 </div>
                 <div>
                   <Label htmlFor="event-registration-link">Registration Link</Label>
                   <Input
                     id="event-registration-link"
                     type="url"
                     value={editingEvent.registrationLink || ''}
                     onChange={(e) => setEditingEvent({ ...editingEvent, registrationLink: e.target.value })}
                     placeholder="https://forms.google.com/..."
                   />
                 </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingEvent.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        {tag}
                        <button
                          onClick={() => removeTag(editingEvent.tags, tag, (tags) => setEditingEvent({ ...editingEvent, tags }))}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(editingEvent.tags, e.currentTarget.value, (tags) => setEditingEvent({ ...editingEvent, tags }));
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveEvent} className="bg-gradient-primary hover:opacity-90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Event
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Member Dialog */}
                 <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle>
                 {editingMember?.id && members.find(m => m.id === editingMember.id) ? 'Edit Member' : 'Add New Member'}
               </DialogTitle>
               <DialogDescription>
                 {editingMember?.id && members.find(m => m.id === editingMember.id) 
                   ? 'Update the member details below.' 
                   : 'Fill in the details to add a new member.'}
               </DialogDescription>
             </DialogHeader>
            {editingMember && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="member-name">Name *</Label>
                    <Input
                      id="member-name"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      placeholder="Member name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-role">Role *</Label>
                    <Input
                      id="member-role"
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      placeholder="e.g., President, Vice President"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="member-department">Department</Label>
                    <Input
                      id="member-department"
                      value={editingMember.department}
                      onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                      placeholder="e.g., Computer Science Engineering"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-year">Year</Label>
                    <Input
                      id="member-year"
                      value={editingMember.year}
                      onChange={(e) => setEditingMember({ ...editingMember, year: e.target.value })}
                      placeholder="e.g., Final Year, Third Year"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="member-description">Description</Label>
                  <Textarea
                    id="member-description"
                    value={editingMember.description}
                    onChange={(e) => setEditingMember({ ...editingMember, description: e.target.value })}
                    placeholder="Member description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingMember.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary/50">
                        {skill}
                        <button
                          onClick={() => removeSkill(editingMember.skills, skill, (skills) => setEditingMember({ ...editingMember, skills }))}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add skill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill(editingMember.skills, e.currentTarget.value, (skills) => setEditingMember({ ...editingMember, skills }));
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="member-github">GitHub</Label>
                    <Input
                      id="member-github"
                      value={editingMember.social?.github || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember,
                        social: { ...editingMember.social, github: e.target.value }
                      })}
                      placeholder="GitHub username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-linkedin">LinkedIn</Label>
                    <Input
                      id="member-linkedin"
                      value={editingMember.social?.linkedin || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember,
                        social: { ...editingMember.social, linkedin: e.target.value }
                      })}
                      placeholder="LinkedIn username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      value={editingMember.social?.email || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember,
                        social: { ...editingMember.social, email: e.target.value }
                      })}
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveMember} className="bg-gradient-primary hover:opacity-90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Member
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* User Dialog */}
                 <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>
                 {editingUser?.id ? 'Edit User' : 'Add New User'}
               </DialogTitle>
               <DialogDescription>
                 {editingUser?.id 
                   ? 'Update the user details below.' 
                   : 'Fill in the details to create a new user.'}
               </DialogDescription>
             </DialogHeader>
            {editingUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-email">Email *</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-role">Role *</Label>
                    <Select value={editingUser.role} onValueChange={(value: 'admin' | 'member' | 'applicant') => setEditingUser({ ...editingUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="applicant">Applicant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="user-status">Status *</Label>
                    <Select value={editingUser.status} onValueChange={(value: 'active' | 'inactive' | 'pending') => setEditingUser({ ...editingUser, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={async () => {
                    if (editingUser.id) {
                      const result = await updateUser(editingUser.id, editingUser);
                      if (result.success) {
                        toast({ title: "User updated", description: "User updated successfully" });
                        setIsUserDialogOpen(false);
                        loadUsers();
                      } else {
                        toast({ title: "Error", description: result.error || "Failed to update user", variant: "destructive" });
                      }
                    } else {
                      const result = await createUser(editingUser);
                      if (result.success) {
                        toast({ title: "User created", description: "User created successfully" });
                        setIsUserDialogOpen(false);
                        loadUsers();
                      } else {
                        toast({ title: "Error", description: result.error || "Failed to create user", variant: "destructive" });
                      }
                    }
                  }} className="bg-gradient-primary hover:opacity-90">
                    <Save className="w-4 h-4 mr-2" />
                    Save User
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Application Dialog */}
                 <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle>
                 Review Join Application
               </DialogTitle>
               <DialogDescription>
                 Review and update the status of this join application.
               </DialogDescription>
             </DialogHeader>
            {editingApplication && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm text-muted-foreground">{editingApplication.firstName} {editingApplication.lastName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{editingApplication.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Department</Label>
                    <p className="text-sm text-muted-foreground">{editingApplication.department}</p>
                  </div>
                  <div>
                    <Label>Year</Label>
                    <p className="text-sm text-muted-foreground">{editingApplication.year}</p>
                  </div>
                </div>
                <div>
                  <Label>Motivation</Label>
                  <p className="text-sm text-muted-foreground">{editingApplication.motivation}</p>
                </div>
                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingApplication.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status *</Label>
                    <Select value={editingApplication.status} onValueChange={(value: 'pending' | 'approved' | 'rejected') => setEditingApplication({ ...editingApplication, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={editingApplication.notes || ''}
                      onChange={(e) => setEditingApplication({ ...editingApplication, notes: e.target.value })}
                      placeholder="Add review notes..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={async () => {
                    if (editingApplication.status === 'pending') {
                      toast({ title: "Cannot update", description: "Cannot update status to pending. Please select approved or rejected.", variant: "destructive" });
                      return;
                    }
                    const result = await updateJoinApplicationStatus(
                      editingApplication.id,
                      editingApplication.status as 'approved' | 'rejected',
                      editingApplication.notes || ''
                    );
                    if (result.success) {
                      if (editingApplication.status === 'approved') {
                        toast({ 
                          title: "Application approved! 🎉", 
                          description: "Welcome email has been sent to the applicant." 
                        });
                      } else {
                        toast({ 
                          title: "Application updated", 
                          description: "Application status updated successfully" 
                        });
                      }
                      setIsApplicationDialogOpen(false);
                      loadJoinApplications();
                    } else {
                      toast({ title: "Error", description: result.error || "Failed to update application", variant: "destructive" });
                    }
                  }} className="bg-gradient-primary hover:opacity-90">
                    <Save className="w-4 h-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </div>
            )}
           </DialogContent>
         </Dialog>
       </div>
     </div>
   );
 };

export default Admin;
