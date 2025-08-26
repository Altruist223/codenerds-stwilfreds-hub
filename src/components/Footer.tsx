import { Code, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

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
              <a 
                href="https://github.com/codenerdsswpg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://in.linkedin.com/company/code-nerds-swpg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/codenerdsswpg/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="mailto:codenerdsswpg@gmail.com" 
                className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                  Activities
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                  Leadership
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-accent transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/join" className="text-muted-foreground hover:text-accent transition-colors">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>St. Wilfred's P.G. College</li>
              <li>Computer Science Dept.</li>
              <li>codenerdsswpg@gmail.com</li>
              <li>+91 89498 83916</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Code Nerds - St. Wilfred's P.G. College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;