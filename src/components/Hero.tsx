import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent font-medium text-sm mb-6">
            St. Wilfred's P.G. College
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="gradient-text">Code</span>{" "}
          <span className="text-foreground">Nerds</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Where passion meets programming. Join our community of tech enthusiasts, 
          innovators, and future developers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-3"
            onClick={() => navigate('/join')}
          >
            Join the Club
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-3"
            onClick={() => navigate('/events')}
          >
            View Events
          </Button>
        </div>
        
        {/* Floating Code Elements */}
        <div className="absolute top-20 left-10 opacity-30 font-tech text-xs text-accent">
          {`console.log('Hello World!');`}
        </div>
        <div className="absolute bottom-20 right-10 opacity-30 font-tech text-xs text-primary">
          {`function innovation() { return true; }`}
        </div>
        <div className="absolute top-40 right-20 opacity-30 font-tech text-xs text-accent">
          {`<CodeNerds />`}
        </div>
      </div>
    </section>
  );
};

export default Hero;