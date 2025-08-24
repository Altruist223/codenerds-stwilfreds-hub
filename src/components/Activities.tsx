import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Event, getEvents } from "@/lib/data";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const [activities, setActivities] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setActivities(getEvents());
  }, []);

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Activities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From hands-on workshops to competitive hackathons, we offer diverse opportunities 
            for learning and growth in the tech world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <Card key={index} className="tech-border hover:card-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-foreground mb-2">
                  {activity.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mb-3">
                  {activity.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {activity.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{activity.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>{activity.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={handleViewAllEvents}
            size="lg" 
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3"
          >
            View All Events
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Activities;