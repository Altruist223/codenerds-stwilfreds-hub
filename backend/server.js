const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for demo purposes - in production, use a database)
let users = [];
let joinApplications = [];

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codenerdsswpg@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password-here' // Use Gmail app password
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Code Nerds Backend Server is running' });
});

// Email endpoints
app.post('/api/email/contact', async (req, res) => {
  try {
    const { to, subject, data } = req.body;
    
    const mailOptions = {
      from: 'codenerdsswpg@gmail.com',
      to: to,
      subject: subject,
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Department:</strong> ${data.department}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <hr>
        <p><em>This message was sent from the Code Nerds website contact form.</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Contact email sent successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.post('/api/email/join-application', async (req, res) => {
  try {
    const { to, subject, data } = req.body;
    
    const mailOptions = {
      from: 'codenerdsswpg@gmail.com',
      to: to,
      subject: subject,
      html: `
        <h2>Join Application Submission</h2>
        <h3>Personal Information:</h3>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        
        <h3>Academic Information:</h3>
        <p><strong>Student ID:</strong> ${data.studentId}</p>
        <p><strong>Department:</strong> ${data.department}</p>
        <p><strong>Year:</strong> ${data.year}</p>
        <p><strong>Semester:</strong> ${data.semester}</p>
        
        <h3>Skills:</h3>
        <p>${data.skills.join(', ')}</p>
        
        <h3>Experience:</h3>
        <p>${data.experience}</p>
        
        <h3>Motivation:</h3>
        <p>${data.motivation}</p>
        
        <h3>Expectations:</h3>
        <p>${data.expectations}</p>
        
        <h3>Availability:</h3>
        <p>${data.availability}</p>
        
        <h3>Social Links:</h3>
        <p><strong>GitHub:</strong> ${data.github}</p>
        <p><strong>LinkedIn:</strong> ${data.linkedin}</p>
        <p><strong>Portfolio:</strong> ${data.portfolio}</p>
        
        <hr>
        <p><em>This application was submitted from the Code Nerds website.</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Join application email sent successfully' });
  } catch (error) {
    console.error('Error sending join application email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// User management endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  try {
    const userData = req.body;
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      role: userData.role || 'applicant',
      status: userData.status || 'pending',
      createdAt: new Date().toISOString(),
      lastLogin: userData.lastLogin
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create user' });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    users[userIndex] = { ...users[userIndex], ...req.body };
    res.json(users[userIndex]);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to delete user' });
  }
});

// Join application management endpoints
app.get('/api/join-applications', (req, res) => {
  res.json(joinApplications);
});

app.get('/api/join-applications/:id', (req, res) => {
  try {
    const { id } = req.params;
    const application = joinApplications.find(app => app.id === id);
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to fetch application' });
  }
});

app.post('/api/join-applications', (req, res) => {
  try {
    const applicationData = req.body;
    const newApplication = {
      id: Date.now().toString(),
      ...applicationData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt: undefined,
      reviewedBy: undefined,
      notes: undefined
    };
    
    joinApplications.push(newApplication);
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to submit application' });
  }
});

app.put('/api/join-applications/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const applicationIndex = joinApplications.findIndex(app => app.id === id);
    
    if (applicationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    joinApplications[applicationIndex] = {
      ...joinApplications[applicationIndex],
      status,
      notes,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'admin' // In production, get from authentication
    };
    
    res.json(joinApplications[applicationIndex]);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update application status' });
  }
});

app.delete('/api/join-applications/:id', (req, res) => {
  try {
    const { id } = req.params;
    const applicationIndex = joinApplications.findIndex(app => app.id === id);
    
    if (applicationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    joinApplications.splice(applicationIndex, 1);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to delete application' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Code Nerds Backend Server running on port ${PORT}`);
  console.log(`📧 Email service configured for: codenerdsswpg@gmail.com`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
});
