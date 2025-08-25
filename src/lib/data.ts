export interface Event {
  id: string;
  title: string;
  description: string;
  frequency: string;
  time: string;
  location: string;
  tags: string[];
  date?: string;
  image?: string;
  registrationLink?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  department: string;
  year: string;
  skills: string[];
  description: string;
  avatar?: string;
  social?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

// Initial events data
export const initialEvents: Event[] = [
  {
    id: "1",
    title: "Weekly Coding Workshops",
    description: "Intensive sessions covering popular programming languages and frameworks like React, Python, and Node.js.",
    frequency: "Every Saturday",
    time: "2:00 PM - 5:00 PM",
    location: "Computer Lab 1",
    tags: ["Beginner Friendly", "Hands-on"],
    date: "2024-01-27"
  },
  {
    id: "2",
    title: "Hackathon Events",
    description: "24-48 hour coding marathons where teams compete to build innovative solutions to real-world problems.",
    frequency: "Monthly",
    time: "Weekend",
    location: "Main Auditorium",
    tags: ["Competition", "Team Work"],
    date: "2024-02-15"
  },
  {
    id: "3",
    title: "Tech Talks & Guest Lectures",
    description: "Industry experts and alumni share insights on latest technologies, career guidance, and industry trends.",
    frequency: "Bi-weekly",
    time: "4:00 PM - 6:00 PM",
    location: "Seminar Hall",
    tags: ["Learning", "Networking"],
    date: "2024-01-30"
  },
  {
    id: "4",
    title: "Project Showcase",
    description: "Members present their innovative projects and get feedback from peers and faculty mentors.",
    frequency: "End of Semester",
    time: "Full Day Event",
    location: "Exhibition Hall",
    tags: ["Innovation", "Presentation"],
    date: "2024-05-15"
  }
];

// Initial members data
export const initialMembers: Member[] = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "President",
    department: "Computer Science Engineering",
    year: "Final Year",
    skills: ["Full Stack Development", "AI/ML", "Leadership"],
    description: "Passionate about creating innovative solutions and building a strong tech community.",
    social: {
      github: "alexjohnson",
      linkedin: "alexjohnson",
      email: "alex.johnson@stwilfreds.edu"
    }
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Vice President",
    department: "Information Technology",
    year: "Third Year",
    skills: ["Web Development", "UI/UX Design", "Project Management"],
    description: "Focused on organizing impactful events and fostering collaborative learning.",
    social: {
      github: "priyasharma",
      linkedin: "priyasharma",
      email: "priya.sharma@stwilfreds.edu"
    }
  },
  {
    id: "3",
    name: "Rahul Patel",
    role: "Technical Lead",
    department: "Computer Science Engineering",
    year: "Final Year",
    skills: ["Backend Development", "DevOps", "Mentoring"],
    description: "Dedicated to technical excellence and helping members grow their coding skills.",
    social: {
      github: "rahulpatel",
      linkedin: "rahulpatel",
      email: "rahul.patel@stwilfreds.edu"
    }
  },
  {
    id: "4",
    name: "Sarah Ahmed",
    role: "Events Coordinator",
    department: "Information Technology",
    year: "Third Year",
    skills: ["Event Planning", "Marketing", "Communication"],
    description: "Expert at organizing hackathons and tech talks that inspire and educate.",
    social: {
      github: "sarahahmed",
      linkedin: "sarahahmed",
      email: "sarah.ahmed@stwilfreds.edu"
    }
  }
];

// Local storage keys
export const STORAGE_KEYS = {
  EVENTS: 'codenerds_events',
  MEMBERS: 'codenerds_members'
};

// Data management functions
export const getEvents = (): Event[] => {
  if (typeof window === 'undefined') return initialEvents;
  const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return stored ? JSON.parse(stored) : initialEvents;
};

export const getMembers = (): Member[] => {
  if (typeof window === 'undefined') return initialMembers;
  const stored = localStorage.getItem(STORAGE_KEYS.MEMBERS);
  return stored ? JSON.parse(stored) : initialMembers;
};

export const saveEvents = (events: Event[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

export const saveMembers = (members: Member[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
};
