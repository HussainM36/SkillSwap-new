import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./friends.css";

function Friends() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `http://localhost:5003/api/matchrequest/friends/${userId}`
      );

      const data = await res.json();

      console.log("FRIENDS DATA:", data);

      if (data.success) {
        setFriends(data.data);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="friends-container">
      <h2>My Friends</h2>

      {friends.map((friend) => (
        <div key={friend._id} className="friend-card">
          <h3>{friend.name}</h3>

          <Link to={`/chat/${friend._id}`}>
            <button>Chat 💬</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Friends;