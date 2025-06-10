BlogMaster

A modern blogging platform with social features, inspired by Tumblr. Share your thoughts, follow other users, and engage with content in a sleek, dark-themed interface.

<img alt="BlogMaster Logo" src="https://via.placeholder.com/800x400?text=BlogMaster">
Features
User Authentication: Secure login and registration system
Content Creation: Create and publish blog posts with rich content
Social Interaction: Follow users, like and comment on posts
Personalized Feed: View content from users you follow
Explore Page: Discover new content and creators
User Profiles: Customize your profile and view others
Responsive Design: Works seamlessly on mobile and desktop devices
Technologies Used
Frontend:

. React.js with Vite for fast development
. Tailwind CSS for styling
. React Router for navigation
. Axios for API requests

Backend:

. Node.js with Express
. MongoDB for database
. JWT for authentication
. Installation
. Prerequisites
. Node.js (v14 or higher)
. npm or yarn
. MongoDB instance

Setup:
 
1. Clone the repository: https://github.com/ajbenc/Blog-app.git
cd blogmaster

2. Install frontend dependencies:

cd tumblr-clone
npm install

3. Install backend dependencies:

cd ../backend
npm install

4. Create env files:

For frontend (.env): VITE_API_URL=http://localhost:5000

For backend (.env): PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

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