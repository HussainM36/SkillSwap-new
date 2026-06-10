import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Messages() {
  const [chats, setChats] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5003/api/messages/${userId}`
      );

      setChats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Messages</h2>

      {chats.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        chats.map((chat) => (
          <Link
            key={chat.friendId}
            to={`/chat/${chat.friendId}`}
            style={{
              display: "block",
              padding: "15px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              textDecoration: "none",
              color: "black",
            }}
          >
            <h3>{chat.name}</h3>
            <p>{chat.lastMessage}</p>
          </Link>
        ))
      )}
    </div>
  );
}

export default Messages;