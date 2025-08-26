import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Linkedin, Mail, Search, Users, ArrowRight } from "lucide-react";
import { Member } from "@/lib/data";
import { getMembers } from "@/lib/firebase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { sanitizeUrl } from "@/lib/utils";

const Members = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      const result = await getMembers();
      if (result.success) {
        const allMembers = result.members as Member[];
        setMembers(allMembers);
        setFilteredMembers(allMembers);
      }
    };
    loadMembers();
  }, []);

  useEffect(() => {
    let filtered = members;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected roles
    if (selectedRoles.length > 0) {
      filtered = filtered.filter(member =>
        selectedRoles.includes(member.role)
      );
    }

    // Filter by selected departments
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(member =>
        selectedDepartments.includes(member.department)
      );
    }

    setFilteredMembers(filtered);
  }, [searchTerm, selectedRoles, selectedDepartments, members]);

  // Get all unique roles and departments from members
  const allRoles = Array.from(new Set(members.map(member => member.role)));
  const allDepartments = Array.from(new Set(members.map(member => member.department)));

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoles([]);
    setSelectedDepartments([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Meet Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get to know the passionate individuals who drive innovation and leadership within the Code Nerds community. 
            Our diverse team brings together expertise from various backgrounds and disciplines.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            {/* Search */}
            <div className="flex justify-center">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search members by name, role, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Sections */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
              {/* Role Filters */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Filter by Role</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {allRoles.map((role) => (
                    <Badge
                      key={role}
                      variant={selectedRoles.includes(role) ? "default" : "secondary"}
                      className={`cursor-pointer transition-all text-xs ${
                        selectedRoles.includes(role)
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                      }`}
                      onClick={() => toggleRole(role)}
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Department Filters */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Filter by Department</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {allDepartments.map((department) => (
                    <Badge
                      key={department}
                      variant={selectedDepartments.includes(department) ? "default" : "secondary"}
                      className={`cursor-pointer transition-all text-xs ${
                        selectedDepartments.includes(department)
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                      }`}
                      onClick={() => toggleDepartment(department)}
                    >
                      {department}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedRoles.length > 0 || selectedDepartments.length > 0) && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold mb-2">No members found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">
                  {filteredMembers.length} Team Member{filteredMembers.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-muted-foreground">
                  {searchTerm && `Searching for "${searchTerm}"`}
                  {selectedRoles.length > 0 && ` • Role: ${selectedRoles.join(', ')}`}
                  {selectedDepartments.length > 0 && ` • Department: ${selectedDepartments.join(', ')}`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="tech-border hover:tech-glow transition-all duration-300 group">
                    <CardContent className="p-6">
                      {/* Avatar with initials */}
                      <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-accent font-medium mb-2">{member.role}</p>
                        <p className="text-sm text-muted-foreground mb-1">{member.department}</p>
                        <p className="text-sm text-muted-foreground">{member.year}</p>
                      </div>

                      <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed line-clamp-3">
                        {member.description}
                      </p>

                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {member.skills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs bg-secondary/50">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-secondary/50">
                            +{member.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center gap-3 mb-4">
                        {member.social?.github && (
                          <a
                            href={sanitizeUrl(member.social.github)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer group-hover:scale-110 transition-transform"
                            title={`View ${member.name}'s GitHub profile`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {member.social?.linkedin && (
                          <a
                            href={sanitizeUrl(member.social.linkedin)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer group-hover:scale-110 transition-transform"
                            title={`View ${member.name}'s LinkedIn profile`}
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.social?.email && (
                          <a
                            href={`mailto:${member.social.email}`}
                            className="p-2 bg-secondary/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer group-hover:scale-110 transition-transform"
                            title={`Send email to ${member.name}`}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                                             <Button 
                         variant="outline" 
                         className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                         onClick={() => navigate('/join')}
                       >
                         Register Now
                         <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want to <span className="gradient-text">Join</span> Our Team?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're always looking for passionate individuals who want to make a difference in the tech community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3">
              Apply Now
            </Button>
            <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Members;
