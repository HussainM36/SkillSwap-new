import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignUpPage.css"; // Custom CSS

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5003/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Signup successful!");
        navigate("/login");
      } else {
        alert(data.message || "❌ Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="logo">SkillSwap</div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <p className="signup-text">Sign up to see skills shared around you.</p>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="login-link">
          Have an account?
          <Link to="/login" className="login-span"> Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
