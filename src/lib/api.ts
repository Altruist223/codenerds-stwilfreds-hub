// API service for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  message: string;
}

export interface JoinApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  department: string;
  year: string;
  semester: string;
  skills: string[];
  experience: string;
  motivation: string;
  expectations: string;
  availability: string;
  github: string;
  linkedin: string;
  portfolio: string;
  agreeToTerms: boolean;
  agreeToCodeOfConduct: boolean;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'applicant';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

export interface JoinApplication extends JoinApplicationData {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

// Email Service
export const emailService = {
  // Send contact form email
  async sendContactEmail(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'codenerdsswpg@gmail.com',
          subject: `Code Nerds Contact Form - ${data.firstName} ${data.lastName}`,
          data
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
      console.error('Error sending contact email:', error);
      return { success: false, message: 'Failed to send email. Please try again.' };
    }
  },

  // Send join application email
  async sendJoinApplicationEmail(data: JoinApplicationData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/join-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'codenerdsswpg@gmail.com',
          subject: `Code Nerds Join Application - ${data.firstName} ${data.lastName}`,
          data
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, message: 'Application submitted successfully!' };
    } catch (error) {
      console.error('Error sending join application email:', error);
      return { success: false, message: 'Failed to submit application. Please try again.' };
    }
  }
};

// User Management Service
export const userService = {
  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Create new user
  async createUser(userData: Partial<User>): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user = await response.json();
      return { success: true, user, message: 'User created successfully!' };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, message: 'Failed to create user.' };
    }
  },

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user = await response.json();
      return { success: true, user, message: 'User updated successfully!' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, message: 'Failed to update user.' };
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true, message: 'User deleted successfully!' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, message: 'Failed to delete user.' };
    }
  }
};

// Join Application Management Service
export const joinApplicationService = {
  // Get all join applications
  async getJoinApplications(): Promise<JoinApplication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/join-applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching join applications:', error);
      return [];
    }
  },

  // Get join application by ID
  async getJoinApplication(id: string): Promise<JoinApplication | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/join-applications/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching join application:', error);
      return null;
    }
  },

  // Submit new join application
  async submitJoinApplication(data: JoinApplicationData): Promise<{ success: boolean; application?: JoinApplication; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/join-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const application = await response.json();
      return { success: true, application, message: 'Application submitted successfully!' };
    } catch (error) {
      console.error('Error submitting join application:', error);
      return { success: false, message: 'Failed to submit application.' };
    }
  },

  // Update join application status
  async updateJoinApplicationStatus(id: string, status: 'approved' | 'rejected', notes?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/join-applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true, message: 'Application status updated successfully!' };
    } catch (error) {
      console.error('Error updating join application status:', error);
      return { success: false, message: 'Failed to update application status.' };
    }
  },

  // Delete join application
  async deleteJoinApplication(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/join-applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true, message: 'Application deleted successfully!' };
    } catch (error) {
      console.error('Error deleting join application:', error);
      return { success: false, message: 'Failed to delete application.' };
    }
  }
};

// Fallback email service using mailto for when backend is not available
export const fallbackEmailService = {
  // Send contact form via mailto
  sendContactEmail(data: ContactFormData): { success: boolean; message: string } {
    try {
      const subject = `Code Nerds Contact Form - ${data.firstName} ${data.lastName}`;
      const body = `
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Department: ${data.department}

Message:
${data.message}

---
This message was sent from the Code Nerds website contact form.
      `;

      const mailtoLink = `mailto:codenerdsswpg@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
      
      return { success: true, message: 'Email client opened with your message. Please send it to complete your inquiry.' };
    } catch (error) {
      return { success: false, message: 'Failed to open email client.' };
    }
  },

  // Send join application via mailto
  sendJoinApplicationEmail(data: JoinApplicationData): { success: boolean; message: string } {
    try {
      const subject = `Code Nerds Join Application - ${data.firstName} ${data.lastName}`;
      const body = `
JOIN APPLICATION FORM

Personal Information:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

Academic Information:
Student ID: ${data.studentId}
Department: ${data.department}
Year: ${data.year}
Semester: ${data.semester}

Skills: ${data.skills.join(', ')}

Experience: ${data.experience}

Motivation: ${data.motivation}

Expectations: ${data.expectations}

Availability: ${data.availability}

Social Links:
GitHub: ${data.github}
LinkedIn: ${data.linkedin}
Portfolio: ${data.portfolio}

---
This application was submitted from the Code Nerds website.
      `;

      const mailtoLink = `mailto:codenerdsswpg@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
      
      return { success: true, message: 'Email client opened with your application. Please send it to complete your submission.' };
    } catch (error) {
      return { success: false, message: 'Failed to open email client.' };
    }
  }
};
