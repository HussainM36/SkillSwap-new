import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserFriends, FaHeart, FaComments, FaClipboardList } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [matchRequestCount, setMatchRequestCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUsername(storedUser.name);
    }

    // Fetch all users
    fetch("http://localhost:5003/api/auth/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });

    // Fetch pending match requests
    const fetchMatchRequests = async () => {
      try {
        if (!storedUser?._id) return;
        const res = await fetch(
          `http://localhost:5003/api/matchRequest/received/${storedUser._id}`
        );
        const data = await res.json();
        if (data?.data) {
          const pending = data.data.filter(
            (req) => !req.isAccepted && !req.isRejected
          );
          setMatchRequestCount(pending.length);
        }
      } catch (err) {
        console.error("Error fetching match requests:", err);
      }
    };

    fetchMatchRequests();
    const interval = setInterval(fetchMatchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMatchRequest = (receiverId) => {
    const sender = JSON.parse(localStorage.getItem("user"));
    if (!sender?._id) return;

    fetch("http://localhost:5003/matchRequest/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: sender._id, receiverId }),
    })
      .then((response) => response.json())
      .then(() => alert("Match request sent!"))
      .catch((error) => console.error("Error sending match request:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        
        <div className="dashboard-nav">
          <button className="quiz-btn" onClick={() => navigate("/quiz")}>
            <FaClipboardList style={{ marginLeft: "16px" }} />
            Take Skill Quiz
          </button>
          
        </div>
      </header>

      {/* Welcome Section */}
      <section className="welcome-section">
        <h2 className="welcome-title">
          {username ? `Welcome, ${username}!` : "Welcome!"}
        </h2>
        <p className="welcome-subtitle">
          Discover new connections and grow your skills with SkillSwap.
        </p>
      </section>

      {/* Dashboard Actions */}
      <section className="dashboard-actions">
        <Link
          to="/MatchNotification"
          className="dashboard-card"
          style={{ position: "relative" }}
        >
          <FaHeart className="dashboard-card-icon" />
          {matchRequestCount > 0 && (
            <span className="notification-badge">{matchRequestCount}</span>
          )}
          <span>Matches Received</span>
        </Link>

        <Link to="/MatchNotification1" className="dashboard-card">
          <FaHeart className="dashboard-card-icon" />
          <span>Matches Sent</span>
        </Link>

        <Link to="/message" className="dashboard-card">
  <FaComments className="dashboard-card-icon" />
  <span>Messages</span>
</Link>

        <Link to="/friends" className="dashboard-card">
          <FaUserFriends className="dashboard-card-icon" />
          <span>Friends</span>
        </Link>
      </section>

      {/* Matches Section */}
      <section className="matches-section">
        <h2>Your Matches</h2>
        {loading ? (
          <p className="loading">Loading matches...</p>
        ) : users.length === 0 ? (
          <p className="no-matches">No matches found.</p>
        ) : (
          <div className="matches-grid">
            {users
              .filter((user) => user.skill && user.skill !== "No skill listed")
              .map((user) => (
                <div className="match-card" key={user._id}>
                  <div className="match-avatar">
                    <img
                      src={user.profilePic || "https://via.placeholder.com/80"}
                      alt={user.name}
                    />
                  </div>
                  <h3>{user.name}</h3>
                  <p>{user.skill}</p>
                  <button
                    className="match-btn"
                    onClick={() => handleMatchRequest(user._id)}
                  >
                    Match
                  </button>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
