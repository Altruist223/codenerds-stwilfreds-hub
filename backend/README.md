# Code Nerds Backend Server

This is the backend server for the Code Nerds website, providing API endpoints for email services, user management, and join application management.

## Features

- **Email Service**: Send contact form emails and join application emails to `codenerdsswpg@gmail.com`
- **User Management**: CRUD operations for user accounts with roles and status
- **Join Application Management**: Handle and review community join applications
- **RESTful API**: Clean, organized endpoints for all operations

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Email Service

The server uses Gmail SMTP for sending emails. You need to:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Set Environment Variable**:
   ```bash
   export EMAIL_PASSWORD="your-app-password-here"
   ```
   
   Or create a `.env` file:
   ```
   EMAIL_PASSWORD=your-app-password-here
   ```

### 3. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on port 3001 by default.

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Email Service
- `POST /api/email/contact` - Send contact form emails
- `POST /api/email/join-application` - Send join application emails

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Join Applications
- `GET /api/join-applications` - Get all applications
- `GET /api/join-applications/:id` - Get specific application
- `POST /api/join-applications` - Submit new application
- `PUT /api/join-applications/:id/status` - Update application status
- `DELETE /api/join-applications/:id` - Delete application

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `EMAIL_PASSWORD` | Gmail app password | Required |

## Data Storage

**Note**: This is a demo implementation using in-memory storage. For production:

1. **Database**: Use MongoDB, PostgreSQL, or MySQL
2. **Authentication**: Implement JWT or session-based auth
3. **Validation**: Add input validation and sanitization
4. **Rate Limiting**: Prevent spam and abuse
5. **Logging**: Add proper logging and monitoring

## Security Considerations

- **CORS**: Configured for development; restrict in production
- **Input Validation**: Add validation for all inputs
- **Authentication**: Implement proper user authentication
- **HTTPS**: Use HTTPS in production
- **Environment Variables**: Never commit sensitive data

## Troubleshooting

### Email Not Sending
1. Check if `EMAIL_PASSWORD` is set correctly
2. Verify Gmail 2FA is enabled
3. Check if app password is generated correctly
4. Check server logs for error details

### Port Already in Use
Change the port in the environment variables or kill the process using the port:
```bash
lsof -ti:3001 | xargs kill -9
```

## Development

The server uses:
- **Express.js** - Web framework
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Auto-restart in development

## License

MIT License - see LICENSE file for details.
