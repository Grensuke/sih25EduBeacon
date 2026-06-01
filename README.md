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
├── .github/workflows/ci.yml             # Frontend production build (CI=true)
├── .gitignore
├── README.md
└── EduBeacon/
    ├── package.json                     # Runs client + server together (npm run dev)
    ├── setup.js                         # Creates server/.env, installs dependencies
    ├── client/                          # React frontend (Create React App)
    │   ├── vercel.json                  # Vercel build settings
    │   ├── .env.example                 # REACT_APP_API_BASE (production)
    │   ├── src/
    │   │   ├── components/              # Pages and dashboards
    │   │   ├── context/AuthContext.js
    │   │   ├── App.js
    │   │   └── index.js                 # Axios base URL configuration
    │   └── package.json
    └── server/                          # Express API
        ├── .env.example                 # Copy to .env (not committed)
        ├── routes/                      # auth, admin, mentor, student
        ├── models/
        ├── middleware/
        ├── config/database.js
        └── server.js
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
git clone https://github.com/Grensuke/sih25EduBeacon.git
cd sih25EduBeacon
```

### 2. One-command setup (recommended)

```bash
cd EduBeacon
npm run setup
```

This copies `server/.env.example` → `server/.env` (if missing) and runs `npm run install-all`.

Edit **`EduBeacon/server/.env`** with your MongoDB URI, `JWT_SECRET`, and `GEMINI_API_KEY`.

### 3. Run locally

```bash
cd EduBeacon
npm run dev
```

- **Frontend:** http://localhost:3000 (CRA proxies `/api` to the backend in development)
- **Backend:** http://localhost:5000 — health check: http://localhost:5000/api/health

### Manual setup (alternative)

```bash
cd EduBeacon
npm run install-all
cd server && cp .env.example .env   # Windows: copy .env.example .env
# Edit server/.env, then from EduBeacon/: npm run dev
```

---

## Environment Variables

| Location | File | Purpose |
|----------|------|---------|
| Backend | `EduBeacon/server/.env` | MongoDB, JWT, Gemini (copy from `.env.example`) |
| Frontend (local) | `EduBeacon/client/.env.local` | Optional; see `.env.example` |
| Frontend (Vercel) | Project env vars | **`REACT_APP_API_BASE`** = your live API URL |

**Development:** `client/package.json` sets `"proxy": "http://localhost:5000"` so Axios can call `/api/...` without a base URL.

**Production:** `client/src/index.js` uses `REACT_APP_API_BASE` or falls back to the configured Render URL. You must set `REACT_APP_API_BASE` on Vercel.

Legacy: `server/config.env` is still read by the server if present; prefer `.env` only.

### Production hardening (Render)

| Variable | Suggested value |
|----------|-----------------|
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | `https://sih25edubeacon.vercel.app` (comma-separate if multiple) |
| `DISABLE_PUBLIC_ADMIN_REGISTER` | `true` after your first admin account exists |

---

## Deployment

The app is split: **static React on Vercel**, **Express API on Render** (or similar).

### Vercel (frontend)

| Setting | Value |
|---------|--------|
| Root Directory | `EduBeacon/client` |
| Framework | Create React App (or use repo `vercel.json`) |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Environment variable | `REACT_APP_API_BASE` = `https://your-api.onrender.com` |

`EduBeacon/client/vercel.json` encodes build/output settings for consistency.

### Render / backend host

1. Root: `EduBeacon/server`
2. Start: `npm start`
3. Set env vars from `server/.env.example` in the dashboard
4. Confirm `GET /api/health` returns `{ "message": "EduBeacon API is running!" }`

### After deploy

Open the Vercel site → login → verify network calls hit your API host (not `localhost`).

### After moving to a new Vercel account (cleanup)

1. **New project only** — In [GitHub → repo → Settings → Integrations](https://github.com/Grensuke/sih25EduBeacon/settings/installations), open **Vercel** and ensure only the new project (`sih25-edu-beacon`) is linked to this repo.
2. **Remove old Vercel project** — On the old account/team, open the previous project (e.g. `sihedubeacon25`) → **Settings** → scroll to **Delete Project**.
3. **Custom domain** — If you use a domain, remove it from the old project, then add it under the new project → **Settings** → **Domains**.
4. **Render** — No change needed if `REACT_APP_API_BASE` still points to the same API URL.

---

## API Documentation

Base URL: `http://localhost:5000` (dev) or your production API host.

All protected routes: `Authorization: Bearer <token>`.

### Authentication

| Method | Path | Body |
|--------|------|------|
| `POST` | `/api/auth/admin-register` | `{ name, email, password, organizationName }` |
| `POST` | `/api/auth/login` | `{ email, password }` |
| `GET` | `/api/auth/me` | — |

### Examples (role-specific)

| Role | Examples |
|------|----------|
| Admin | `GET /api/admin/users`, `POST /api/admin/users`, `GET /api/admin/departments` |
| Mentor | `GET /api/mentor/students`, `GET /api/mentor/analytics`, `GET /api/mentor/student-profile/:id` |
| Student | `POST /api/student/chatbot`, `GET /api/student/timetable` |

See `EduBeacon/README.md` for a fuller endpoint list.

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

1. **Authentication**: JWT tokens (30-day expiry in `routes/auth.js`)
2. **Password Hashing**: bcrypt (12 rounds in `User` model pre-save)
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