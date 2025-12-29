# 🌟 BlogMaster

<div align="center">

![BlogMaster](https://img.shields.io/badge/BlogMaster-v1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Cloud-47A248.svg?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**A modern, full-stack social blogging platform inspired by Tumblr**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

BlogMaster is a feature-rich blogging platform that combines the best of social media and content creation. Built with modern technologies, it offers a seamless experience for creating, sharing, and discovering content in a beautifully designed dark-themed interface.

### ✨ Key Highlights

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 📝 **Rich Content Creation** - Support for text, images, and videos
- 👥 **Social Features** - Follow users, like, comment, and repost content
- 🎨 **Customizable Profiles** - Personalize with avatars, backgrounds, and themes
- 🔍 **Content Discovery** - Explore page with tag-based browsing
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🌐 **Tumblr Integration** - Browse and interact with Tumblr content
- ⚡ **Real-time Updates** - React Query for efficient data management

---

<img width="2559" height="1279" alt="Captura de pantalla 2025-12-23 145030" src="https://github.com/user-attachments/assets/f789d373-2ebb-4e82-8791-55674f9591ea" />


## 🎯 Features

### 🔑 Authentication & User Management
- Secure user registration and login
- JWT token-based authentication
- Profile customization (avatar, bio, theme colors)
- Follow/unfollow system

### 📝 Content Management
- Create text, image, and video posts
- Edit and manage your own posts
- Tag system for better organization
- Cloudinary integration for media storage

### 💬 Social Interactions
- Like and unlike posts
- Comment on posts
- Repost functionality
- View following feed
- Explore trending content

### 🎨 User Experience
- Dark-themed modern UI
- Responsive design for all devices
- Smooth animations and transitions
- Infinite scroll (ready for implementation)
- Profile customization with theme colors

### 🔗 External Integration
- Tumblr API integration
- Browse Tumblr blogs and tags
- Local simulation for Tumblr interactions

---

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **Vite** - Build tool & dev server
- **React Router 7.6.2** - Navigation
- **Tailwind CSS 3.4.3** - Styling
- **React Query 5.80.7** - Server state management
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Media management
- **Multer** - File uploads

---


### 💻 Local Development

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Cloudinary** account
- **Tumblr API** key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blogmaster.git
   cd blogmaster
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   JWT_SECRET=<your-secret-key-minimum-32-characters>
   JWT_EXPIRES_IN=7d
   PORT=4000
   
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   
   TUMBLR_API_KEY=<your-tumblr-api-key>
   ```

3. **Frontend Setup**
   ```bash
   cd ../tumblr-clone
   npm install
   ```

   Create a `.env` file in the `tumblr-clone` directory:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

4. **Run the Application**

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd tumblr-clone
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

---

## 📁 Project Structure

```
blogmaster/
├── backend/                 # Backend API server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── uploads/            # Upload handlers
│
└── tumblr-clone/           # Frontend React app
    ├── public/             # Static assets
    └── src/
        ├── components/     # Reusable components
        ├── features/       # Feature modules
        ├── hooks/          # Custom hooks
        ├── services/       # API services
        └── utils/          # Utility functions
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Edit post
- `PUT /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `POST /api/posts/:id/repost` - Repost

### Users
- `GET /api/auth/users` - Get all users
- `GET /api/auth/users/:id` - Get user by ID
- `POST /api/auth/follow/:id` - Follow user
- `POST /api/auth/unfollow/:id` - Unfollow user

### Tumblr
- `GET /api/tumblr/blog/:blogId/posts` - Get Tumblr blog posts
- `GET /api/tumblr/tag/:tag` - Get posts by tag



---

## 🖼️ Screenshots

### Login Page
<img width="2554" height="1269" alt="Captura de pantalla 2025-12-23 141535" src="https://github.com/user-attachments/assets/a338b0b0-1843-456f-bdc7-5bd71f1d94e4" />


### Dashboard
<img width="2559" height="1276" alt="Captura de pantalla 2025-12-23 145125" src="https://github.com/user-attachments/assets/d6913471-bc4c-43bb-938f-5aafd72ae57c" />


### Explore Page
<img width="2559" height="1278" alt="Captura de pantalla 2025-12-23 145114" src="https://github.com/user-attachments/assets/0d26be01-fd65-4e5f-a570-97772877ed0e" />


### User Profile
<img width="2559" height="1278" alt="Captura de pantalla 2025-12-23 145148" src="https://github.com/user-attachments/assets/733687f5-9b1c-4d79-a74f-00f0f0f2878a" />


---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation
- ✅ Secure token storage

---

## 🎨 Design Philosophy

BlogMaster embraces a **dark-first design** philosophy with:
- Modern, minimalist interface
- Smooth animations and transitions
- Intuitive user interactions
- Mobile-responsive layouts
- Accessibility considerations

---


## 🚀 Deployment

### Quick Deploy Options

**Frontend:**
- [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new)
- [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

**Backend:**
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Heroku](https://heroku.com)

**Database:**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

See [Deployment Guide](./DOCUMENTATION.md#deployment-guide) for detailed instructions.

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] Direct messaging system
- [ ] Real-time notifications
- [ ] Advanced search and filters
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Dark/light theme toggle
- [ ] Bookmarks feature

---


## 🐛 Known Issues

- Tumblr API rate limiting may affect content loading
- Media upload size limited by Cloudinary free tier
- Following feed requires manual refresh

---

## 📝 License

This project is licensed under the MIT License 

## 👨‍💻 Author

**Your Name**
- GitHub: [@ajbenc](https://github.com/ajbenc)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/andres-julian-benavides-camayo/)


---

## 🙏 Acknowledgments

- Inspired by [Tumblr](https://www.tumblr.com)
- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- UI inspiration from modern social platforms

---

## 📞 Support

If you have any questions or run into issues, please:
- Open an issue on GitHub


---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ and ☕

</div>

For backend (.env): PORT=5000
MONGODB_URI=YOUR MONGO URI

Usage:

1. Start the backend server: cd backend / npm run start

2. in a new terminal start the frontend: cd tumblr-clone / npm run dev

Project Structure:

blogmaster/
├── backend/                # Backend server
│   ├── controllers/        # API controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
│
├── tumblr-clone/           # Frontend application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── features/       # Feature-specific components
│   │   │   ├── auth/       # Authentication-related
│   │   │   └── posts/      # Post-related
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── index.html          # HTML entry


License
MIT © [Ajbenc]

Note: This project was created as a learning exercise and is not affiliated with Tumblr.
