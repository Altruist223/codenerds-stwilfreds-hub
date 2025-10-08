# 🚀 Code Nerds Community Hub - Complete Project

A comprehensive community management platform built with React, TypeScript, Tailwind CSS, and Firebase.

## ✨ **Features**

### **🌐 Public Pages**
- **Homepage** - Hero section, about, activities, leadership, contact
- **Events Page** - View all events with search and filtering
- **Members Page** - Browse community members by role/department
- **Join Application** - Community membership application form

### **🔐 Admin Dashboard**
- **Secure Authentication** - Firebase email/password login
- **Event Management** - Add, edit, delete events
- **Member Management** - Add, edit, delete community members
- **User Management** - Admin user accounts management
- **Join Applications** - Review and manage membership applications
- **Real-time Data** - Firebase Firestore integration

### **📧 Contact System**
- **Contact Form** - Send messages to codenerdsswpg@gmail.com
- **Join Applications** - Store applications in Firebase database
- **Email Integration** - Mailto fallback for contact forms

## 🛠️ **Tech Stack**

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Routing**: React Router DOM
- **State Management**: React Hooks + Context API
- **Build Tool**: Vite

## 🚀 **Quick Start**

### **1. Clone & Install**
```bash
git clone https://github.com/Altruist223/codenerds-stwilfreds-hub.git
cd codenerds-stwilfreds-hub
npm install
```

### **2. Firebase Setup**
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy your Firebase config to `src/lib/firebase.ts`
5. Create admin user in Firebase Auth

### **3. Environment Variables**
Copy `env-example.txt` to `.env.local` and fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### **4. Run Development Server**
```bash
npm run dev
```

### **5. Access Admin Dashboard**
- Navigate to `/admin/login`
- Use your Firebase admin credentials
- Access full admin dashboard at `/admin`

### **6. Production Deployment**
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Netlify deployment instructions.

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Navigation.tsx # Main navigation
│   ├── Hero.tsx       # Homepage hero section
│   ├── About.tsx      # About section
│   ├── Activities.tsx # Events display
│   ├── Leadership.tsx # Members display
│   ├── Contact.tsx    # Contact form
│   └── Footer.tsx     # Site footer
├── pages/              # Page components
│   ├── Index.tsx      # Homepage
│   ├── Events.tsx     # Events page
│   ├── Members.tsx    # Members page
│   ├── Admin.tsx      # Admin dashboard
│   ├── AdminLogin.tsx # Admin login
│   └── JoinApplication.tsx # Join form
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/                # Utilities and services
│   ├── firebase.ts    # Firebase configuration
│   ├── data.ts        # Local data management
│   └── api.ts         # API interfaces
└── hooks/              # Custom hooks
    └── use-toast.ts   # Toast notifications
```

## 🔐 **Admin Features**

### **Authentication**
- Secure login with Firebase Auth
- Protected admin routes
- Automatic session management
- Logout functionality

### **Event Management**
- Create new events with title, description, date, location
- Edit existing events
- Delete events
- Tag-based categorization
- Past/upcoming event filtering

### **Member Management**
- Add new community members
- Edit member information
- Delete members
- Role and department organization
- Social media links

### **User Management**
- Create admin user accounts
- Manage user permissions
- Track user activity
- Secure user data

### **Join Applications**
- View all membership applications
- Review application details
- Approve/reject applications
- Add review notes
- Track application status

## 🌐 **Public Features**

### **Events Display**
- Browse all community events
- Search by title/description
- Filter by tags
- Past vs upcoming events
- Responsive grid layout

### **Member Directory**
- View community leadership
- Filter by role/department
- Search functionality
- Professional profiles
- Social media integration

### **Join Application Form**
- Comprehensive application process
- Personal information
- Academic details
- Skills assessment
- Motivation statement
- Terms agreement
- Firebase database storage

### **Contact System**
- Contact form for inquiries
- Direct email integration
- Professional communication
- Quick response system

## 🎨 **Design Features**

### **Modern UI/UX**
- Clean, professional design
- Responsive layout
- Dark/light theme support
- Smooth animations
- Professional color scheme

### **Component Library**
- shadcn/ui components
- Consistent design system
- Accessible components
- Modern interactions

### **Responsive Design**
- Mobile-first approach
- Tablet optimization
- Desktop experience
- Touch-friendly interface

## 🔒 **Security Features**

### **Authentication**
- Firebase Auth integration
- Secure login system
- Session management
- Protected routes

### **Data Protection**
- Firestore security rules
- User permission system
- Secure API endpoints
- Data validation

## 📱 **Responsive Design**

- **Mobile**: Optimized for small screens
- **Tablet**: Enhanced tablet experience
- **Desktop**: Full-featured desktop interface
- **Touch**: Touch-friendly interactions

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Deploy Options**
- **Vercel**: Automatic deployment from GitHub
- **Netlify**: Drag & drop deployment
- **Firebase Hosting**: Integrated with Firebase
- **GitHub Pages**: Static site hosting

## 🔧 **Configuration**

### **Firebase Setup**
1. Create Firebase project
2. Enable Authentication
3. Enable Firestore
4. Set security rules
5. Configure environment variables

### **Customization**
- Update colors in `tailwind.config.js`
- Modify components in `src/components/`
- Add new pages in `src/pages/`
- Extend functionality in `src/lib/`

## 📊 **Data Management**

### **Local Storage**
- Events and members cached locally
- Offline functionality
- Data persistence

### **Firebase Firestore**
- Real-time data synchronization
- Scalable database
- Automatic backups
- Security rules

## 🎯 **Future Enhancements**

- **Real-time Chat**: Community chat system
- **Event Registration**: RSVP functionality
- **File Uploads**: Document sharing
- **Notifications**: Push notifications
- **Analytics**: Usage statistics
- **Multi-language**: Internationalization

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Email: codenerdsswpg@gmail.com
- Create GitHub issue
- Check documentation

---

**Built with ❤️ by Code Nerds Community**
