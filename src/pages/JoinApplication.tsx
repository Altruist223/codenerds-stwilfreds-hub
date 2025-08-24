import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { joinApplicationService, fallbackEmailService, JoinApplicationData } from "@/lib/api";

const JoinApplication = () => {
  const [formData, setFormData] = useState<JoinApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    department: "",
    year: "",
    semester: "",
    skills: [],
    experience: "",
    motivation: "",
    expectations: "",
    availability: "",
    github: "",
    linkedin: "",
    portfolio: "",
    agreeToTerms: false,
    agreeToCodeOfConduct: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const departments = [
    "Computer Science Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Other"
  ];

  const years = ["First Year", "Second Year", "Third Year", "Final Year"];
  const semesters = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];

  const skillOptions = [
    "JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
    "React", "Vue.js", "Angular", "Node.js", "Express.js", "Django", "Flask",
    "HTML/CSS", "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Git",
    "Machine Learning", "Data Science", "Mobile Development", "UI/UX Design",
    "DevOps", "Cybersecurity", "Blockchain", "IoT", "Cloud Computing"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms || !formData.agreeToCodeOfConduct) {
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the terms and code of conduct to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Try to submit via backend first
      const result = await joinApplicationService.submitJoinApplication(formData);
      
      if (result.success) {
        toast({
          title: "Application Submitted!",
          description: result.message,
        });
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          studentId: "",
          department: "",
          year: "",
          semester: "",
          skills: [],
          experience: "",
          motivation: "",
          expectations: "",
          availability: "",
          github: "",
          linkedin: "",
          portfolio: "",
          agreeToTerms: false,
          agreeToCodeOfConduct: false
        });
      } else {
        // Fallback to email if backend fails
        const fallbackResult = fallbackEmailService.sendJoinApplicationEmail(formData);
        
        if (fallbackResult.success) {
          toast({
            title: "Application Prepared!",
            description: fallbackResult.message,
          });
          
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            studentId: "",
            department: "",
            year: "",
            semester: "",
            skills: [],
            experience: "",
            motivation: "",
            expectations: "",
            availability: "",
            github: "",
            linkedin: "",
            portfolio: "",
            agreeToTerms: false,
            agreeToCodeOfConduct: false
          });
        } else {
          throw new Error(fallbackResult.message);
        }
      }

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Join <span className="gradient-text">Code Nerds</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to be part of our innovative tech community? Fill out the application form below 
            and take the first step towards joining the Code Nerds family.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="tech-border">
            <CardHeader>
              <CardTitle className="text-3xl text-center">
                Community Application Form
              </CardTitle>
              <p className="text-muted-foreground text-center">
                Please fill out all required fields to complete your application
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-accent">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="your.email@stwilfreds.edu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-accent">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studentId">Student ID *</Label>
                      <Input
                        id="studentId"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange("studentId", e.target.value)}
                        required
                        placeholder="Enter your student ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Year of Study *</Label>
                      <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="semester">Current Semester</Label>
                      <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((sem) => (
                            <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Skills and Experience */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-accent">Skills & Experience</h3>
                  <div>
                    <Label>Technical Skills (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {skillOptions.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={formData.skills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label htmlFor={skill} className="text-sm">{skill}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="experience">Previous Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="Describe any previous programming, project, or tech experience you have..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Motivation and Expectations */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-accent">Motivation & Expectations</h3>
                  <div>
                    <Label htmlFor="motivation">Why do you want to join Code Nerds? *</Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => handleInputChange("motivation", e.target.value)}
                      required
                      placeholder="Tell us about your motivation for joining our community..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectations">What do you hope to gain from Code Nerds?</Label>
                    <Textarea
                      id="expectations"
                      value={formData.expectations}
                      onChange={(e) => handleInputChange("expectations", e.target.value)}
                      placeholder="Describe your learning goals and expectations..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability">How much time can you dedicate weekly?</Label>
                    <Input
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => handleInputChange("availability", e.target.value)}
                      placeholder="e.g., 5-10 hours per week"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-accent">Social & Portfolio Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="github">GitHub Profile</Label>
                      <Input
                        id="github"
                        value={formData.github}
                        onChange={(e) => handleInputChange("github", e.target.value)}
                        placeholder="github.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolio">Portfolio Website</Label>
                      <Input
                        id="portfolio"
                        value={formData.portfolio}
                        onChange={(e) => handleInputChange("portfolio", e.target.value)}
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-accent">Terms & Conditions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        required
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the <span className="text-accent cursor-pointer hover:underline">Terms of Service</span> and <span className="text-accent cursor-pointer hover:underline">Privacy Policy</span> *
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToCodeOfConduct"
                        checked={formData.agreeToCodeOfConduct}
                        onCheckedChange={(checked) => handleInputChange("agreeToCodeOfConduct", checked as boolean)}
                        required
                      />
                      <Label htmlFor="agreeToCodeOfConduct" className="text-sm">
                        I agree to follow the <span className="text-accent cursor-pointer hover:underline">Code of Conduct</span> and community guidelines *
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-primary hover:opacity-90 text-lg py-3"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JoinApplication;
