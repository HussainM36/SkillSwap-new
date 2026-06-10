import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPen,
  FaBriefcase,
} from "react-icons/fa";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    skill: "",
    category: "",
    experience: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");

      console.log("User ID:", userId);

      if (!userId || userId === "undefined") {
        alert(
          "User ID not found. Please login again."
        );
        return;
      }

      const data = new FormData();

      data.append("id", userId);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("contact", formData.contact);
      data.append("skill", formData.skill);
      data.append("category", formData.category);
      data.append("experience", formData.experience);

      if (photo) {
        data.append("photo", photo);
      }

      const response = await axios.post(
        "http://localhost:5003/api/profiles",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      setSaved(true);

      alert("✅ Profile Saved Successfully");
    } catch (error) {
      console.error(
        "PROFILE SAVE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save profile"
      );
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <h2>Edit Profile</h2>

        <div className="profile-avatar">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
            />
          ) : (
            <div className="placeholder-avatar">
              Upload Image
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="avatar-upload"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="profile-form"
        >
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPhone className="icon" />
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPen className="icon" />
            <input
              type="text"
              name="skill"
              placeholder="Skill"
              value={formData.skill}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPen className="icon" />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaBriefcase className="icon" />
            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
          >
            Save Profile
          </button>

          {saved && (
            <p className="success-message">
              ✅ Profile Saved Successfully
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;