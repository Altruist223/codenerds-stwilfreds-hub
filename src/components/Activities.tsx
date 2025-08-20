import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const Activities = () => {
  const activities = [
    {
      title: "Weekly Coding Workshops",
      description: "Intensive sessions covering popular programming languages and frameworks like React, Python, and Node.js.",
      frequency: "Every Saturday",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 1",
      tags: ["Beginner Friendly", "Hands-on"]
    },
    {
      title: "Hackathon Events",
      description: "24-48 hour coding marathons where teams compete to build innovative solutions to real-world problems.",
      frequency: "Monthly",
      time: "Weekend",
      location: "Main Auditorium",
      tags: ["Competition", "Team Work"]
    },
    {
      title: "Tech Talks & Guest Lectures",
      description: "Industry experts and alumni share insights on latest technologies, career guidance, and industry trends.",
      frequency: "Bi-weekly",
      time: "4:00 PM - 6:00 PM",
      location: "Seminar Hall",
      tags: ["Learning", "Networking"]
    },
    {
      title: "Project Showcase",
      description: "Members present their innovative projects and get feedback from peers and faculty mentors.",
      frequency: "End of Semester",
      time: "Full Day Event",
      location: "Exhibition Hall",
      tags: ["Innovation", "Presentation"]
    }
  ];

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
      </div>
    </section>
  );
};

export default Activities;