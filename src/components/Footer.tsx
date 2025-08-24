import { Code, Github, Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">
                <span className="gradient-text">Code</span> Nerds
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The premier technology club at St. Wilfred's P.G. College, fostering innovation, 
              learning, and collaboration among tech enthusiasts.
            </p>
            <div className="flex gap-3">
              <div className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <Github className="w-4 h-4" />
              </div>
              <div className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </div>
              <div className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us", "Activities", "Leadership", "Events", "Join Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>St. Wilfred's P.G. College</li>
              <li>Computer Science Dept.</li>
              <li>codenerds@stwilfred.edu</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Code Nerds - St. Wilfred's P.G. College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;