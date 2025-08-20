import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail } from "lucide-react";

const Leadership = () => {
  const leaders = [
    {
      name: "Alex Johnson",
      role: "President",
      department: "Computer Science Engineering",
      year: "Final Year",
      skills: ["Full Stack Development", "AI/ML", "Leadership"],
      description: "Passionate about creating innovative solutions and building a strong tech community."
    },
    {
      name: "Priya Sharma",
      role: "Vice President",
      department: "Information Technology",
      year: "Third Year",
      skills: ["Web Development", "UI/UX Design", "Project Management"],
      description: "Focused on organizing impactful events and fostering collaborative learning."
    },
    {
      name: "Rahul Patel",
      role: "Technical Lead",
      department: "Computer Science Engineering",
      year: "Final Year",
      skills: ["Backend Development", "DevOps", "Mentoring"],
      description: "Dedicated to technical excellence and helping members grow their coding skills."
    },
    {
      name: "Sarah Ahmed",
      role: "Events Coordinator",
      department: "Information Technology",
      year: "Third Year",
      skills: ["Event Planning", "Marketing", "Communication"],
      description: "Expert at organizing hackathons and tech talks that inspire and educate."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Our <span className="gradient-text">Leadership</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our dedicated team of student leaders who drive the vision and activities of Code Nerds, 
            ensuring every member gets the best learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((leader, index) => (
            <Card key={index} className="tech-border hover:tech-glow transition-all duration-300 group">
              <CardContent className="p-6">
                {/* Avatar placeholder with initials */}
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {leader.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-accent font-medium mb-2">{leader.role}</p>
                  <p className="text-sm text-muted-foreground mb-1">{leader.department}</p>
                  <p className="text-sm text-muted-foreground">{leader.year}</p>
                </div>

                <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
                  {leader.description}
                </p>

                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {leader.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs bg-secondary/50">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <div className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                    <Mail className="w-4 h-4" />
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

export default Leadership;