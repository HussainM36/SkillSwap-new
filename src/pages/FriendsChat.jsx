import React, {
  useEffect,
  useState
} from "react";

import { useParams } from "react-router-dom";
import axios from "axios";

const FriendsChat = () => {
  const { friendId } = useParams();

  const userId =
    localStorage.getItem("userId");

  const [messages, setMessages] =
    useState([]);

  const [newMessage, setNewMessage] =
    useState("");

  useEffect(() => {
    if (!userId || !friendId) return;

    fetchMessages();
  }, [friendId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5003/api/chat/messages/${userId}/${friendId}`
      );

      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        "http://localhost:5003/api/chat/send",
        {
          senderId: userId,
          receiverId: friendId,
          text: newMessage,
        }
      );

      const recentChats =
        JSON.parse(
          localStorage.getItem(
            "recentChats"
          )
        ) || [];

      const updatedChats =
        recentChats.filter(
          (chat) =>
            chat.friendId !== friendId
        );

      updatedChats.unshift({
        friendId,
        lastMessage: newMessage,
      });

      localStorage.setItem(
        "recentChats",
        JSON.stringify(updatedChats)
      );

      setNewMessage("");

      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat</h2>

      <div
        style={{
          height: "500px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              textAlign:
                msg.sender === userId
                  ? "right"
                  : "left",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                background:
                  msg.sender === userId
                    ? "#4CAF50"
                    : "#e5e5e5",
                color:
                  msg.sender === userId
                    ? "white"
                    : "black",
                padding:
                  "10px 15px",
                borderRadius:
                  "20px",
                display:
                  "inline-block",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "15px",
          gap: "10px",
        }}
      >
        <input
          value={newMessage}
          onChange={(e) =>
            setNewMessage(
              e.target.value
            )
          }
          style={{
            flex: 1,
            padding: "10px",
          }}
        />

        <button
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default FriendsChat;