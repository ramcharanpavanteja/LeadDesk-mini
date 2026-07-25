import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/login", formData);

    await api.post("/api/auth/login", formData);

      navigate("/admin");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-logo">
          LeadDesk<span>.</span>
        </div>

        <p className="eyebrow">ADMIN PORTAL</p>

        <h1>Welcome back</h1>

        <p className="login-description">
          Sign in to manage incoming leads.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email">Email</label>

            <input
              id="admin-email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>

            <input
              id="admin-password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="server-error">{error}</div>}

          <button
            className="submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button
          className="back-home-button"
          onClick={() => navigate("/")}
        >
          ← Back to website
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;