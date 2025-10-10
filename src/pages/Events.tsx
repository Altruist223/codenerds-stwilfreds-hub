import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Search, Filter, ArrowRight } from "lucide-react";
import { Event } from "@/lib/data";
import { getEvents } from "@/lib/firebase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [eventType, setEventType] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    const loadEvents = async () => {
      const result = await getEvents();
      if (result.success) {
        const allEvents = result.events as Event[];
        setEvents(allEvents);
        setFilteredEvents(allEvents);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(event =>
        selectedTags.some(tag => event.tags.includes(tag))
      );
    }

    // Filter by event type (past/upcoming)
    if (eventType !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(event => {
        if (!event.date) return eventType === "upcoming"; // Events without dates are considered upcoming
        
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        if (eventType === "upcoming") {
          return eventDate >= today;
        } else if (eventType === "past") {
          return eventDate < today;
        }
        return true;
      });
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedTags, eventType, events]);

  // Get all unique tags from events
  const allTags = Array.from(
    new Set(
      events.flatMap(event => (Array.isArray(event.tags) ? event.tags : []))
    )
  );

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setEventType("all");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="gradient-text">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover exciting opportunities to learn, compete, and grow with the Code Nerds community. 
            From workshops to hackathons, there's something for everyone.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

                         {/* Event Type Filter */}
             <div className="flex gap-2">
               <Button
                 variant={eventType === "all" ? "default" : "outline"}
                 size="sm"
                 onClick={() => setEventType("all")}
               >
                 All Events
               </Button>
               <Button
                 variant={eventType === "upcoming" ? "default" : "outline"}
                 size="sm"
                 onClick={() => setEventType("upcoming")}
               >
                 Upcoming
               </Button>
               <Button
                 variant={eventType === "past" ? "default" : "outline"}
                 size="sm"
                 onClick={() => setEventType("past")}
               >
                 Past
               </Button>
             </div>

             {/* Filter Tags */}
             <div className="flex flex-wrap gap-2">
               {allTags.map((tag) => (
                 <Badge
                   key={tag}
                   variant={selectedTags.includes(tag) ? "default" : "secondary"}
                   className={`cursor-pointer transition-all ${
                     selectedTags.includes(tag)
                       ? "bg-primary text-primary-foreground"
                       : "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                   }`}
                   onClick={() => toggleTag(tag)}
                 >
                   {tag}
                 </Badge>
               ))}
             </div>

                         {/* Clear Filters */}
             {(searchTerm || selectedTags.length > 0 || eventType !== "all") && (
               <Button
                 variant="outline"
                 onClick={clearFilters}
                 className="text-muted-foreground hover:text-foreground"
               >
                 Clear Filters
               </Button>
             )}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} Found
                </h2>
                                 <p className="text-muted-foreground">
                   {searchTerm && `Searching for "${searchTerm}"`}
                   {selectedTags.length > 0 && ` • Filtered by: ${selectedTags.join(', ')}`}
                   {eventType !== "all" && ` • Showing: ${eventType === "upcoming" ? "Upcoming" : "Past"} events`}
                 </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="tech-border hover:card-glow transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                            {event.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray(event.tags) ? event.tags : []).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span className="font-medium">Frequency:</span>
                          <span>{event.frequency}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="font-medium">Time:</span>
                          <span>{event.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span className="font-medium">Location:</span>
                          <span>{event.location}</span>
                        </div>
                        
                        {event.date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-accent" />
                            <span className="font-medium">Next Date:</span>
                            <span className="text-foreground font-medium">
                              {formatDate(event.date)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                                                 <Button 
                           variant="outline" 
                           className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                           onClick={() => {
                             if (event.registrationLink) {
                               window.open(event.registrationLink, '_blank');
                             } else {
                               // Fallback to join page if no registration link
                               navigate('/join');
                             }
                           }}
                         >
                           Register Now
                           <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want to <span className="gradient-text">Join</span> Our Events?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Become a part of our vibrant tech community and start your journey with Code Nerds.
          </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button 
               size="lg" 
               className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3"
               onClick={() => navigate('/join')}
             >
               Join the Club
             </Button>
             <Button 
               variant="outline" 
               size="lg" 
               className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-3"
               onClick={() => navigate('/#contact')}
             >
               Contact Us
             </Button>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
