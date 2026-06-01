# EduBeacon - Smart India Hackathon 2025

## Project Overview

**EduBeacon** is an AI-powered student dropout prevention system designed to provide intelligent counseling, personalized support, and data-driven insights to help every student thrive. The platform addresses the critical challenge of student dropout rates by combining predictive analytics, AI counseling, and mentor support.

### Key Features

- 🤖 **AI Counseling** - 24/7 intelligent chatbot providing real-time support and guidance
- 📊 **Analytics Dashboard** - Real-time insights and predictive analytics to identify at-risk students
- 👥 **Mentor Support** - Connect students with mentors for academic and personal guidance
- 🎓 **Student Profiles** - Comprehensive analytics including attendance, academic performance, and fee status
- 📱 **Multi-role System** - Separate dashboards for Admin, Mentor, and Student roles
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 💼 **Organization Management** - Support for multiple institutions and departments

---

## Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS v3** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization library
- **React Calendar** - Event scheduling component

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment configuration

### Development Tools
- **Nodemon** - Auto-reload for development
- **npm** - Package manager
- **Create React App** - React project scaffolding

---

## Project Structure

```
sih25EduBeacon/
├── EduBeacon/
│   ├── client/                          # React frontend
│   │   ├── src/
│   │   │   ├── components/              # React components
│   │   │   │   ├── AdminRegister.js     # Admin registration page
│   │   │   │   ├── Dashboard.js         # Main dashboard router
│   │   │   │   ├── Home.js              # Landing page
│   │   │   │   ├── Login.js             # Login page
│   │   │   │   ├── DataPopulator.js     # Sample data generator
│   │   │   │   ├── SmoothWavyCanvas.js  # Animated background
│   │   │   │   ├── StudentProfile.js    # Student profile details
│   │   │   │   ├── StudentsOverview.js  # Student list overview
│   │   │   │   └── dashboards/          # Role-specific dashboards
│   │   │   │       ├── AdminDashboard.js
│   │   │   │       ├── MentorDashboard.js
│   │   │   │       └── StudentDashboard.js
│   │   │   ├── context/
│   │   │   │   └── AuthContext.js       # Authentication context
│   │   │   ├── App.js                   # Main app component
│   │   │   ├── index.js                 # Entry point
│   │   │   └── index.css                # Global styles & Tailwind
│   │   ├── public/                      # Static assets
│   │   ├── package.json
│   │   └── tailwind.config.js
│   │
│   └── server/                          # Node.js backend
│       ├── routes/                      # API routes
│       ├── models/                      # MongoDB schemas
│       ├── middleware/                  # Custom middleware
│       ├── .env                         # Environment variables
│       ├── server.js                    # Express server
│       └── package.json
│
├── firebase.json                        # Firebase configuration
├── firestore.rules                      # Firestore security rules
├── README.md                            # Project documentation
└── .gitignore
```

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sih25EduBeacon
```

### 2. Backend Setup

```bash
cd EduBeacon/server

# Install dependencies
npm install

# Create .env file with configuration
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/edubeacon
JWT_SECRET=your_jwt_secret_key_change_this_in_production
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
EOF

# Start the server with Nodemon
npm run dev
```

**Server will run on:** `http://localhost:5000`

### 3. Frontend Setup

```bash
cd EduBeacon/client

# Install dependencies
npm install

# Start the development server
npm start
```

**Frontend will run on:** `http://localhost:3000`

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/edubeacon
JWT_SECRET=your_jwt_secret_key_change_this_in_production
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### Frontend (Proxy Configuration)
The frontend is configured to proxy API requests to `http://localhost:5000` during development.

---

## API Documentation

### Authentication Endpoints

#### Admin Registration
```
POST /api/auth/register-admin
Body: { name, email, password, organizationName }
Response: { success, token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, user }
```

### Dashboard Endpoints

#### Get Dashboard Analytics
```
GET /api/dashboard/analytics
Headers: Authorization: Bearer <token>
Response: { analytics data based on user role }
```

#### Get Student Profile
```
GET /api/mentor/student-profile/:studentId
Headers: Authorization: Bearer <token>
Response: { student details, attendance, grades, fee status }
```

---

## User Roles & Permissions

### 1. **Admin**
- Manage users and departments
- View platform-wide analytics
- Generate invitation codes
- Access sample data populator
- System configuration

### 2. **Mentor**
- Manage assigned students
- View student analytics
- Track attendance and risk levels
- Generate reports
- Schedule counseling sessions

### 3. **Student**
- View personal profile
- Check attendance and grades
- Access AI counselor
- View schedule and events
- Track academic progress

---

## Features Detailed

### 1. AI Counseling
- Real-time chatbot powered by Gemini API
- 24/7 availability
- Personalized responses based on student data
- Integration with student profile data

### 2. Analytics Dashboard
- Real-time risk level assessment
- Attendance trends and patterns
- Academic performance metrics
- Fee payment status tracking
- Predictive dropout indicators

### 3. Student Profiles
- Comprehensive student information
- Attendance history with percentages
- Academic grades and GPA
- Fee payment status
- Risk level classification
- Connected mentor information

### 4. Theme & UI
- **Color Theme**: Modern blue gradient palette
  - Primary: `rgb(59, 130, 246)` (#3b82f6)
  - Secondary: `rgb(37, 99, 235)` (#2563eb)
  - Accent: `rgb(96, 165, 250)` (#60a5fa)
- **Background Animation**: SmoothWavyCanvas component with animated moving lines
- **Glassmorphism**: Modern glass-effect UI elements
- **Responsive Design**: Mobile-friendly layouts

---

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/mentor/student),
  organizationId: ObjectId,
  departmentId: ObjectId,
  uniqueCode: String,
  createdAt: Date
}
```

### Student Model
```javascript
{
  userId: ObjectId,
  rollNumber: String,
  attendanceData: {
    percentage: Number,
    classes_attended: Number,
    total_classes: Number
  },
  academicData: {
    gpa: Number,
    semester: Number,
    grades: [Number]
  },
  feeData: {
    totalFee: Number,
    paidAmount: Number,
    paymentStatus: String
  },
  riskLevel: String (low/medium/high)
}
```

---

## Running the Application

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd EduBeacon/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd EduBeacon/client
npm start
```

### Access the Application
1. Open `http://localhost:3000` in your browser
2. For admin access: Click "Get Started" to register
3. For mentor/student: Use login with existing credentials
4. Test with sample data using the Data Populator feature

---

## Debugging & Troubleshooting

### Frontend Issues
- Clear cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check for console errors in browser DevTools

### Backend Issues
- Ensure MongoDB is running: `mongod`
- Check .env file for correct configuration
- Verify port 5000 is not in use: `lsof -i :5000`
- Check API responses in browser Network tab

### Database Issues
- Connect to MongoDB: `mongosh mongodb://localhost:27017/edubeacon`
- View collections: `db.getCollectionNames()`
- Clear database: `db.dropDatabase()`

---

## Performance Optimizations

- ✅ Code splitting with React Router
- ✅ Image optimization with appropriate formats
- ✅ Database query indexing
- ✅ JWT token-based stateless auth
- ✅ Client-side caching strategies
- ✅ Efficient chart rendering with Recharts

---

## Security Considerations

1. **Authentication**: JWT tokens with 24-hour expiration
2. **Password Hashing**: bcryptjs with salt rounds of 10
3. **Input Validation**: Server-side validation on all endpoints
4. **CORS**: Configured for development (update for production)
5. **Environment Variables**: Sensitive data in .env files
6. **Role-Based Access Control**: Middleware for route protection

---

## UI/UX Details

### Color Scheme
- **Primary Blue**: `#3b82f6` (rgb(59, 130, 246)) - Main accent color
- **Secondary Blue**: `#2563eb` (rgb(37, 99, 235)) - Darker shade
- **Light Blue**: `#60a5fa` (rgb(96, 165, 250)) - Lighter shade
- **Dark Background**: `#0f172a` - Navbar and canvas background

### Components
- **Navigation Bar**: Glassmorphism effect with semi-transparent background
- **Buttons**: Gradient background with hover effects
- **Cards**: Glass effect with backdrop blur
- **Input Fields**: Custom styled with color theme
- **Animations**: SmoothWavyCanvas provides animated moving lines background

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Email notifications for at-risk students
- [ ] Advanced ML models for dropout prediction
- [ ] Integration with institutional systems
- [ ] Multi-language support
- [ ] Video counseling sessions
- [ ] Parent portal access
- [ ] Mobile-optimized counselor app

---

## Bug Fixes & Improvements (Latest)

✅ **Fixed Issues:**
1. Login button styling - Added card/button styling for better UX
2. Color theme inconsistencies - Updated all old colors to new theme
3. React Hook errors - Fixed with useCallback and proper dependencies
4. SmoothWavyCanvas integration - Properly configured in App.js
5. Dashboard color updates - Consistent theme across all dashboards
6. All UI components - Updated to use Tailwind primary color classes

**Status**: All compilation errors cleared ✅

---

## Contributors

- **Team Lead**: [Your Name]
- **Frontend Developer**: [Name]
- **Backend Developer**: [Name]
- **AI/ML Specialist**: [Name]

---

## License

This project is part of Smart India Hackathon 2025 and is subject to SIH competition guidelines.

---

## Contact & Support

For questions or support, please contact:
- Email: team@edubeacon.com
- GitHub Issues: [Repository Issues]

---

## Acknowledgments

- Smart India Hackathon 2025
- React and Node.js communities
- MongoDB and open-source contributors

---

**Last Updated**: January 2026  
**Status**: Active Development ✅  
**Version**: 1.0.0-beta  
**UI Theme**: Modern Blue Gradient with Glassmorphism  
**Animation**: Smooth Wavy Canvas Background