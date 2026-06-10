import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";

// ========================
// Socket connection
// ========================
const socket = io("http://localhost:5003", { transports: ["websocket"] });

// ========================
// Pages
// ========================
import Landing from "./pages/Landing";
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Home from './pages/Home';
import Match from "./pages/Match";
import ProfilePage from './pages/ProfilePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ChatRoom from './pages/ChatRoom';
import ForgetPassword from './pages/ForgetPassword';
import MatchNotification from './pages/MatchNotification';
import MatchNotification1 from './pages/MatchNotification1';
import Friends from './pages/Friends';
import FriendsChat from "./pages/FriendsChat";
import Quiz from "./pages/Quiz";
import Messages from "./pages/Messages";
// ========================
// Components
// ========================
import Navbar from './pages/navbar'; 

// ========================
// Styles
// ========================
import "./App.css";
import "./Layout.css";

// ========================
// PrivateRoute Component
// ========================
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// ========================
// App Component
// ========================
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />

          <main className="page-wrapper">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              {/* <Route path="/" element={<SignUpPage />} /> */}
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/ForgetPassword" element={<ForgetPassword />} />
              <Route path="/MatchNotification" element={<MatchNotification/>} />
              <Route path="/MatchNotification1" element={<MatchNotification1/>} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/chat/:friendId" element={<FriendsChat />} />


              {/* Protected Routes */}
              <Route path="/search" element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              } />
              <Route
  path="/messages"
  element={
    <PrivateRoute>
      <Messages />
    </PrivateRoute>
  }
/>
              <Route path="/match" element={
                <PrivateRoute>
                  <Match />
                </PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />

              <Route path="/chat/:user1Id/:user2Id" element={
                <PrivateRoute>
                  <ChatRoom socket={socket} />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
