# MERN Real-Time Chat Application

A full-stack real-time messaging application built with the **MERN** stack (MongoDB, Express, React, Node.js), **Socket.io** for real-time communication, and **JWT** for secure authentication. The app also uses **TailwindCSS** for styling and **Daisy UI** for UI components. It includes **global state management** using **Zustand** and robust **error handling** on both the client and server.

![image](https://github.com/user-attachments/assets/f7f29a54-e281-4d65-ab65-c4cc1bfbd478)


## 🌟 Features

- **Authentication & Authorization** with JWT (JSON Web Tokens)
- **Real-time messaging** using Socket.io
- **Online user status** (tracks users who are online)
- **Global state management** with Zustand
- **Responsive UI** styled with TailwindCSS and Daisy UI
- **Error handling** on both server and client
- **Deployment instructions** to deploy like a pro for free

![image](https://github.com/user-attachments/assets/61d0380e-ea95-4372-b7c4-2ce179859483)

## 🛠 Tech Stack

- **Frontend**:
  - React
  - TailwindCSS
  - Daisy UI
  - Zustand (for global state management)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - Socket.io
- **Authentication**:
  - JWT (JSON Web Tokens)
- **Real-time Features**:
  - Socket.io
- **Error Handling**:
  - Custom error handling (both server and client)

## 📦 Installation

### 1. Clone the repository:
```bash
git clone https://github.com/arc-ch/chat-app.git
cd chat-app
```

### 2. Install Backend Dependencies:
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies:
```bash
cd frontend
npm install
```

### 4. Configure Environment Variables:
- Create `.env` files in both the `frontend` and `backend` directories.
- Add necessary variables like:
  - MongoDB URI (`MONGO_URI`)
  - JWT secret key (`JWT_SECRET`)
  - Socket.io server URL (`SOCKET_SERVER_URL`)

### 5. Run the Server and Client

- **Start the Backend (Server):**
  ```bash
  cd backend
  npm start
  ```

- **Start the Frontend (Client):**
  ```bash
  cd frontend
  npm start
  ```

### 6. Visit the Application:
Open your browser and go to `http://localhost:3000` to see the app in action.

## 📡 API Endpoints

### **Authentication Routes:**
- **POST /auth/signup**: Register a new user
- **POST /auth/login**: Login and receive a JWT token

### **User Routes:**
- **GET /users/me**: Get the logged-in user's data
- **GET /users/online**: Get the list of online users

### **Messaging Routes:**
- **GET /messages**: Get all messages in the active chat room
- **POST /messages**: Send a new message to the active chat room

## 🚀 Deployment

### Frontend Deployment:
1. Push your code to a GitHub repository.
2. Deploy the frontend using [Vercel](https://vercel.com/) by importing your GitHub project.

### Backend Deployment:
1. Push your server code to GitHub.
2. Deploy the backend using [Heroku](https://www.heroku.com/):
   - Link your GitHub repository.
   - Set up environment variables like `MONGO_URI`, `JWT_SECRET`, etc.
   - Deploy and access the app!

## 💡 Contributing

Feel free to fork the repository, make improvements, and open pull requests. If you have any ideas, issues, or suggestions, please open an issue, and I'll get back to you as soon as possible.

## 📜 License

This project is licensed under the MIT License.
