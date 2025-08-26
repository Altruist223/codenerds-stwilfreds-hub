import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/api";

const Setup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create the first admin user
      const userData: User = {
        id: "",
        email,
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      
      const result = await createUser(userData);
      
      if (result.success) {
        toast({
          title: "Setup Complete!",
          description: "Admin user created successfully. You can now log in.",
        });
        navigate('/admin/login');
      } else {
        toast({
          title: "Setup Failed",
          description: result.error || "Failed to create admin user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Setup error:", error);
      toast({
        title: "Setup Failed",
        description: "An unexpected error occurred during setup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md tech-border">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            <span className="gradient-text">Code</span> Nerds Setup
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Create your first admin user to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@codenerds.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Setting Up..." : "Complete Setup"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Setup Instructions:
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• This setup creates your first admin user</li>
              <li>• Use a strong password with at least 6 characters</li>
              <li>• Remember to keep your credentials secure</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup;