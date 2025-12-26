# BlogMaster - Comprehensive Technical Documentation

> **Internal Documentation** - Complete technical reference for developers and maintainers

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Authentication & Authorization](#authentication--authorization)
8. [Frontend Architecture](#frontend-architecture)
9. [Backend Architecture](#backend-architecture)
10. [Environment Configuration](#environment-configuration)
11. [Features Documentation](#features-documentation)
12. [Development Workflow](#development-workflow)
13. [Security Considerations](#security-considerations)
14. [Deployment Guide](#deployment-guide)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview

**BlogMaster** is a modern, full-stack social blogging platform inspired by Tumblr. It provides users with a rich content creation and sharing experience, complete with social networking features like following, liking, commenting, and reposting.

### Key Features

- **User Authentication & Authorization**: Secure JWT-based authentication system
- **Content Management**: Create, edit, and delete posts with text and media support
- **Social Interactions**: Follow/unfollow users, like, comment, and repost content
- **Media Handling**: Cloudinary integration for image/video uploads
- **Tumblr Integration**: Browse and interact with Tumblr content via API
- **Personalized Feeds**: Dashboard, Following, and Explore pages
- **User Profiles**: Customizable profiles with avatars, backgrounds, themes
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Project Goals

- Provide a modern, user-friendly blogging platform
- Integrate external content sources (Tumblr API)
- Demonstrate full-stack development best practices
- Showcase portfolio-ready application architecture

---

## Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄────────┤  Express API    │◄────────┤   MongoDB       │
│  (Port 5173)    │  HTTP   │  (Port 4000)    │  Driver │   (Cloud)       │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │                           
        │                           │                           
        │                           ▼                           
        │                   ┌─────────────────┐               
        │                   │   Cloudinary    │               
        │                   │   (Media CDN)   │               
        │                   └─────────────────┘               
        │                                                       
        └────────────────► ┌─────────────────┐               
                           │   Tumblr API    │               
                           │   (External)    │               
                           └─────────────────┘               
```

### Communication Flow

1. **Client → Server**: REST API calls with JWT authentication
2. **Server → Database**: Mongoose ODM for MongoDB operations
3. **Server → Cloudinary**: Media upload and storage
4. **Client → Tumblr API**: Direct calls via proxy for external content

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI framework |
| Vite | 6.3.5 | Build tool & dev server |
| React Router | 7.6.2 | Client-side routing |
| Tailwind CSS | 3.4.3 | Utility-first styling |
| Axios | 1.9.0 | HTTP client |
| React Query | 5.80.7 | Server state management |
| React Icons | 5.5.0 | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime environment |
| Express | 4.18.2 | Web framework |
| MongoDB | 6.16.0 | Database driver |
| Mongoose | 8.15.0 | ODM for MongoDB |
| JWT | 9.0.2 | Authentication tokens |
| Bcrypt | 6.0.0 | Password hashing |
| Cloudinary | 2.6.1 | Media management |
| Multer | 2.0.0 | File upload handling |
| CORS | 2.8.5 | Cross-origin support |

---

## Project Structure

```
Blogapp/
├── backend/                    # Backend API server
│   ├── config/                # Configuration files
│   │   ├── cloudinary.js     # Cloudinary setup
│   │   └── db.js             # MongoDB connection
│   ├── controllers/           # Request handlers
│   │   ├── authController.js # Auth logic
│   │   └── postController.js # Post operations
│   ├── middlewares/           # Custom middleware
│   │   └── authMiddleware.js # JWT verification
│   ├── models/                # Mongoose schemas
│   │   ├── User.js           # User model
│   │   ├── Post.js           # Post model
│   │   └── Message.js        # Message model
│   ├── routes/                # API routes
│   │   ├── authRoutes.js     # Auth endpoints
│   │   ├── postRoutes.js     # Post endpoints
│   │   └── tumblrRoutes.js   # Tumblr proxy
│   ├── services/              # Business logic
│   │   └── tumblrService.js  # Tumblr API client
│   ├── uploads/               # Upload handlers
│   │   └── uploadController.js
│   ├── .env                   # Environment variables
│   ├── package.json           # Dependencies
│   └── server.js             # Entry point
│
└── tumblr-clone/              # Frontend React app
    ├── public/                # Static assets
    ├── src/
    │   ├── assets/           # Images, fonts, etc.
    │   ├── components/       # Reusable components
    │   │   ├── buttons/      # Button components
    │   │   ├── common/       # Shared components
    │   │   ├── guards/       # Route guards
    │   │   ├── inputs/       # Form inputs
    │   │   └── layout/       # Layout components
    │   ├── context/          # React Context
    │   │   └── AuthContext.jsx
    │   ├── features/         # Feature modules
    │   │   ├── auth/         # Authentication
    │   │   ├── posts/        # Post management
    │   │   ├── search/       # Search functionality
    │   │   ├── tumblr/       # Tumblr integration
    │   │   ├── user/         # User profile
    │   │   └── users/        # User browsing
    │   ├── hooks/            # Custom React hooks
    │   ├── services/         # API services
    │   ├── utils/            # Utility functions
    │   ├── App.jsx           # Root component
    │   └── main.jsx          # Entry point
    ├── .env                  # Environment variables
    ├── index.html            # HTML template
    ├── package.json          # Dependencies
    ├── tailwind.config.js    # Tailwind config
    └── vite.config.js        # Vite config
```

---

## Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, min: 6),
  avatar: String,
  profileBg: String,
  bio: String,
  website: String,
  location: String,
  themeColor: String,
  following: [ObjectId] (ref: 'User'),
  likedTumblrPosts: [String],
  repostedTumblrPosts: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model

```javascript
{
  user: ObjectId (required, ref: 'User'),
  content: String (required),
  type: String (enum: ['text', 'image', 'video']),
  mediaUrl: String,
  mediaFiles: [String],
  tags: [String],
  likes: [ObjectId] (ref: 'User'),
  likesCount: Number (default: 0),
  comments: [{
    user: ObjectId (ref: 'User'),
    text: String (required),
    createdAt: Date (default: now)
  }],
  reposts: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model

```javascript
{
  sender: ObjectId (required, ref: 'User'),
  receiver: ObjectId (required, ref: 'User'),
  content: String (required),
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Reference

### Base URL

- Development: `http://localhost:4000/api`
- Production: `https://your-domain.com/api`

### Authentication Endpoints

#### POST `/auth/register`
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/auth/login`
Authenticate a user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/auth/profile`
Get current user profile (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "bio": "Software Developer",
  "website": "https://example.com",
  "location": "San Francisco",
  "themeColor": "#a1c4fd"
}
```

#### PUT `/auth/profile`
Update user profile (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "bio": "Full Stack Developer",
  "website": "https://johndoe.com",
  "avatar": "https://...",
  "themeColor": "#ff6b6b"
}
```

#### GET `/auth/users`
Get list of all users (Protected)

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "avatar": "https://..."
  }
]
```

#### GET `/auth/users/:id`
Get specific user by ID (Protected)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "bio": "Software Developer"
}
```

#### POST `/auth/follow/:id`
Follow a user (Protected)

**Response:**
```json
{
  "following": ["507f1f77bcf86cd799439011", "..."]
}
```

#### POST `/auth/unfollow/:id`
Unfollow a user (Protected)

**Response:**
```json
{
  "following": ["507f1f77bcf86cd799439011"]
}
```

#### GET `/auth/following/posts`
Get posts from followed users (Protected)

**Response:**
```json
[
  {
    "_id": "...",
    "user": { "name": "John", "avatar": "..." },
    "content": "Hello world!",
    "likes": [],
    "comments": [],
    "createdAt": "2025-12-23T10:00:00.000Z"
  }
]
```

### Post Endpoints

#### POST `/posts`
Create a new post (Protected)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
content: "Check out this post!"
type: "image"
tags: ["art", "photography"]
media: [File]
```

**Response:**
```json
{
  "_id": "...",
  "user": "507f1f77bcf86cd799439011",
  "content": "Check out this post!",
  "type": "image",
  "mediaFiles": ["https://..."],
  "tags": ["art", "photography"],
  "likes": [],
  "comments": [],
  "reposts": [],
  "createdAt": "2025-12-23T10:00:00.000Z"
}
```

#### GET `/posts`
Get all posts (Protected)

**Response:**
```json
[
  {
    "_id": "...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "avatar": "https://..."
    },
    "content": "Hello world!",
    "type": "text",
    "tags": ["hello"],
    "likes": [],
    "likesCount": 0,
    "comments": [],
    "reposts": [],
    "createdAt": "2025-12-23T10:00:00.000Z"
  }
]
```

#### PUT `/posts/:id`
Edit a post (Protected, Owner only)

**Request Body:**
```json
{
  "content": "Updated content",
  "tags": ["updated", "post"]
}
```

#### PUT `/posts/:id/like`
Like/unlike a post (Protected)

**Response:**
```json
{
  "likes": ["507f1f77bcf86cd799439011"],
  "likesCount": 1
}
```

#### POST `/posts/:id/comment`
Add a comment to a post (Protected)

**Request Body:**
```json
{
  "text": "Great post!"
}
```

**Response:**
```json
{
  "comments": [
    {
      "user": {
        "_id": "...",
        "name": "Jane",
        "avatar": "..."
      },
      "text": "Great post!",
      "createdAt": "2025-12-23T10:00:00.000Z"
    }
  ]
}
```

#### POST `/posts/:id/repost`
Repost a post (Protected)

**Response:**
```json
{
  "reposts": ["507f1f77bcf86cd799439011"]
}
```

### Tumblr Integration Endpoints

#### GET `/tumblr/blog/:blogIdentifier/posts`
Get posts from a Tumblr blog

**Query Parameters:**
- `limit`: Number of posts (default: 20)
- `offset`: Pagination offset

**Response:**
```json
{
  "posts": [
    {
      "id": "...",
      "blog_name": "staff",
      "post_url": "https://...",
      "timestamp": 1703330000,
      "summary": "Post content...",
      "tags": ["tumblr"],
      "photos": [...]
    }
  ]
}
```

#### GET `/tumblr/tag/:tag`
Get posts by tag from Tumblr

**Query Parameters:**
- `limit`: Number of posts (default: 20)

---

## Authentication & Authorization

### JWT Authentication

The application uses JSON Web Tokens (JWT) for stateless authentication.

#### Token Structure

```javascript
{
  id: "507f1f77bcf86cd799439011", // User ID
  iat: 1703330000,                 // Issued at
  exp: 1703934800                  // Expires (7 days)
}
```

#### Token Storage

- **Frontend**: Stored in `localStorage` as `token`
- **Backend**: Verified via `authMiddleware.js`

#### Protected Routes

All routes requiring authentication use the `protect` middleware:

```javascript
import { protect } from '../middlewares/authMiddleware.js';

router.get('/profile', protect, getProfile);
```

#### Authorization Flow

1. User logs in with credentials
2. Server validates and returns JWT
3. Client stores token in localStorage
4. Client includes token in Authorization header for subsequent requests
5. Server validates token and extracts user ID
6. Request proceeds with `req.user.id` available

### Password Security

- Passwords hashed using bcrypt with 10 salt rounds
- Plain text passwords never stored
- Password comparison done via bcrypt.compare()

---

## Frontend Architecture

### Component Organization

#### Feature-Based Structure

Components are organized by feature in the `src/features/` directory:

```
features/
├── auth/          # Authentication features
├── posts/         # Post-related features
├── tumblr/        # Tumblr integration
├── user/          # User profile
└── users/         # User browsing
```

#### Component Types

1. **Pages**: Full page components (e.g., `DashboardPage.jsx`)
2. **Components**: Reusable UI components (e.g., `PostCard.jsx`)
3. **Layouts**: Layout wrappers (e.g., `PrivateLayout.jsx`)
4. **Guards**: Route protection (e.g., `PrivateRoute.jsx`)

### State Management

#### React Context

- **AuthContext**: Global authentication state
  - User information
  - Token management
  - Login/logout functions
  - Follow/unfollow operations

#### React Query

Used for server state management:

```javascript
// Example: Fetching posts
const { data: posts, isLoading } = usePostsQuery(token);

// Example: Mutation
const { mutate: likePost } = useLikePostMutation(token);
```

### Routing

#### Route Structure

```javascript
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
  
  {/* Protected routes */}
  <Route path="/" element={<PrivateRoute><PrivateLayout /></PrivateRoute>}>
    <Route path="feed" element={<DashboardPage />} />
    <Route path="following" element={<FollowingPage />} />
    <Route path="explore" element={<ExplorePage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="profile/:userId" element={<ProfilePage />} />
  </Route>
</Routes>
```

### Styling Approach

- **Tailwind CSS**: Utility-first styling
- **Dark Theme**: Default color scheme
- **Responsive**: Mobile-first breakpoints
- **Custom Colors**: Defined in tailwind.config.js

---

## Backend Architecture

### Layered Architecture

```
Routes → Controllers → Models → Database
   ↓         ↓           ↓
Middleware  Services  Validation
```

### Middleware Stack

1. **CORS**: Cross-origin resource sharing
2. **JSON Parser**: Body parsing
3. **Auth Middleware**: JWT verification
4. **Multer**: File upload handling

### Error Handling

Consistent error responses:

```javascript
res.status(404).json({ message: "User not found" });
res.status(500).json({ message: "Server error" });
res.status(400).json({ message: "Invalid credentials" });
```

### File Upload Flow

1. Client selects file
2. Form data sent to `/posts` with multipart/form-data
3. Multer middleware processes upload
4. File uploaded to Cloudinary
5. URL stored in database

---

## Environment Configuration

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/BlogData

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=4000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Tumblr
TUMBLR_API_KEY=your-tumblr-api-key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:4000
```

### Production Configuration

**Important**: Never commit `.env` files to version control. Use `.env.example` files as templates.

---

## Features Documentation

### User Authentication

#### Registration
- Email validation (unique, lowercase)
- Password strength (min 6 characters)
- Automatic login after registration
- JWT token generation

#### Login
- Credential validation
- Bcrypt password comparison
- Token generation (7-day expiry)
- User data returned

### Content Creation

#### Post Types
- **Text**: Simple text posts
- **Image**: Single or multiple images
- **Video**: Video uploads

#### Media Upload
- Cloudinary CDN integration
- Multiple file support
- Automatic URL generation
- Responsive image delivery

### Social Features

#### Following System
- Follow/unfollow users
- Following list stored in user document
- Following feed shows posts from followed users

#### Interactions
- **Like**: Toggle like on posts
- **Comment**: Add text comments
- **Repost**: Share posts to your profile

### Profile Customization

Users can customize:
- Avatar image
- Profile background
- Bio text
- Website URL
- Location
- Theme color

### Tumblr Integration

- Browse Tumblr blogs
- View posts by tags
- Like/repost Tumblr content (local simulation)
- Cached in localStorage

---

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd Blogapp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../tumblr-clone
npm install
```

### Running Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

**Terminal 2 (Frontend):**
```bash
cd tumblr-clone
npm run dev
# Client runs on http://localhost:5173
```

### Development Tools

- **Nodemon**: Auto-restart backend on changes
- **Vite HMR**: Hot module replacement for frontend
- **React DevTools**: Component debugging
- **MongoDB Compass**: Database GUI

### Code Style

- **ESLint**: Configured for React
- **Prettier**: Code formatting (if configured)
- **Consistent naming**: camelCase for variables, PascalCase for components

---

## Security Considerations

### Current Implementation

✅ **Implemented:**
- JWT authentication
- Password hashing (bcrypt)
- Protected routes
- CORS configuration
- Input validation on models
- Authorization checks (user owns post)

### Recommendations for Production

⚠️ **To Implement:**

1. **Environment Variables**
   - Move sensitive data to secure vault
   - Use different secrets per environment
   - Rotate keys regularly

2. **Rate Limiting**
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use('/api/', limiter);
   ```

3. **Input Sanitization**
   - Add express-validator
   - Sanitize user inputs
   - Prevent XSS attacks

4. **HTTPS**
   - Force HTTPS in production
   - Use secure cookies
   - Enable HSTS

5. **Database Security**
   - Use connection pooling
   - Implement query timeouts
   - Enable MongoDB authentication

6. **API Key Protection**
   - Store Tumblr API key server-side only
   - Use environment-specific keys
   - Implement key rotation

---

## Deployment Guide

### Prerequisites

- Node.js hosting (Heroku, Render, Railway, etc.)
- MongoDB Atlas account
- Cloudinary account
- Domain name (optional)

### Backend Deployment (Render Example)

1. **Create New Web Service**
   - Connect GitHub repository
   - Select `backend` folder as root
   - Build command: `npm install`
   - Start command: `npm start`

2. **Environment Variables**
   - Add all variables from `.env`
   - Use production MongoDB URI
   - Set `NODE_ENV=production`

3. **Database Setup**
   - Create MongoDB Atlas cluster
   - Whitelist all IPs or specific IPs
   - Create database user
   - Get connection string

### Frontend Deployment (Vercel/Netlify)

1. **Build Configuration**
   ```json
   {
     "build": {
       "command": "npm run build",
       "publish": "dist"
     }
   }
   ```

2. **Environment Variables**
   - Set `VITE_API_URL` to production API URL

3. **Redirects** (for SPA routing)
   ```
   /*  /index.html  200
   ```

### Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Test post creation
- [ ] Test media uploads
- [ ] Test following system
- [ ] Test profile updates
- [ ] Verify CORS settings
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Set up analytics (optional)

---

## Troubleshooting

### Common Issues

#### "Cannot connect to database"
**Solution:**
- Check MongoDB URI in `.env`
- Verify network access in MongoDB Atlas
- Check if database user credentials are correct

#### "CORS policy error"
**Solution:**
- Ensure frontend URL is in CORS whitelist
- Check if credentials are enabled
- Verify request headers

#### "Token expired"
**Solution:**
- User needs to log in again
- Check JWT_EXPIRES_IN value
- Verify token is being sent correctly

#### "Failed to upload media"
**Solution:**
- Verify Cloudinary credentials
- Check file size limits
- Ensure multer is configured correctly

#### "Posts not loading"
**Solution:**
- Check API endpoint URL
- Verify authentication token
- Check network tab in DevTools
- Review server logs

### Debug Mode

Enable debug logging:

```javascript
// Backend (server.js)
const DEBUG = process.env.NODE_ENV !== 'production';
if (DEBUG) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}
```

---

## Performance Optimization

### Backend Optimizations

1. **Database Indexing**
   ```javascript
   userSchema.index({ email: 1 });
   postSchema.index({ createdAt: -1 });
   ```

2. **Pagination**
   ```javascript
   const posts = await Post.find()
     .limit(20)
     .skip(page * 20);
   ```

3. **Population Limits**
   ```javascript
   .populate('user', 'name avatar')
   ```

### Frontend Optimizations

1. **React Query Caching**
   - Automatic cache management
   - Stale-while-revalidate pattern
   - Background refetching

2. **Lazy Loading**
   ```javascript
   const DashboardPage = lazy(() => import('./DashboardPage'));
   ```

3. **Image Optimization**
   - Cloudinary transformations
   - Lazy loading images
   - Responsive images

---

## Future Enhancements

### Planned Features

- [ ] Direct messaging system
- [ ] Notifications
- [ ] Advanced search and filtering
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Dark/light theme toggle
- [ ] Bookmarks/saved posts
- [ ] Hashtag system
- [ ] Trending posts algorithm
- [ ] User verification badges

### Technical Improvements

- [ ] Implement Redis for caching
- [ ] Add GraphQL API
- [ ] WebSocket for real-time features
- [ ] Implement CDN for static assets
- [ ] Add comprehensive test suite
- [ ] Set up CI/CD pipeline
- [ ] Implement monitoring (Sentry, LogRocket)
- [ ] Add API documentation (Swagger)
- [ ] Optimize bundle size
- [ ] Implement service workers (PWA)

---

## Contributing

### Development Guidelines

1. Create feature branch from `main`
2. Make changes with clear commits
3. Test thoroughly
4. Submit pull request
5. Wait for code review

### Commit Message Format

```
feat: Add user profile customization
fix: Resolve login token expiration
docs: Update API documentation
style: Format code with prettier
refactor: Simplify post creation logic
test: Add user authentication tests
```

---

## License

This project is created for educational and portfolio purposes.

---

