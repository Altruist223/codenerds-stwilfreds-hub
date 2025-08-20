import { Card, CardContent } from "@/components/ui/card";
import { Code, Users, Trophy, Lightbulb } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Code,
      title: "Learn & Code",
      description: "Master programming languages, frameworks, and cutting-edge technologies through hands-on workshops and coding sessions."
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with like-minded tech enthusiasts, share knowledge, and build lasting friendships in our inclusive community."
    },
    {
      icon: Trophy,
      title: "Compete",
      description: "Participate in hackathons, coding competitions, and tech challenges to showcase your skills and win exciting prizes."
    },
    {
      icon: Lightbulb,
      title: "Innovate",
      description: "Work on real-world projects, develop innovative solutions, and turn your creative ideas into reality."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Code Nerds</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are the premier technology club at St. Wilfred's P.G. College, dedicated to fostering 
            innovation, learning, and collaboration among tech enthusiasts. Our mission is to create 
            a vibrant community where students can explore, learn, and excel in technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="tech-border hover:tech-glow transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;