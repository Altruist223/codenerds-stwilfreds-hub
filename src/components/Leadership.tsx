import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Member } from "@/lib/data";
import { getMembers } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { sanitizeUrl } from "@/lib/utils";

const Leadership = () => {
  const [leaders, setLeaders] = useState<Member[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMembers = async () => {
      const result = await getMembers();
      if (result.success) {
        setLeaders(result.members as Member[]);
      }
    };
    loadMembers();
  }, []);

  const handleViewAllMembers = () => {
    navigate('/members');
  };

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
                  {leader.social?.github && (
                    <a
                      href={sanitizeUrl(leader.social.github)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      title={`View ${leader.name}'s GitHub profile`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {leader.social?.linkedin && (
                    <a
                      href={sanitizeUrl(leader.social.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      title={`View ${leader.name}'s LinkedIn profile`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {leader.social?.email && (
                    <a
                      href={`mailto:${leader.social.email}`}
                      className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      title={`Send email to ${leader.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Members Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={handleViewAllMembers}
            size="lg" 
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3"
          >
            View All Members
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Leadership;