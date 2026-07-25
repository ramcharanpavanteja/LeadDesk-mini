import { useState } from "react";
import api from "../api";
import "../App.css";

function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.budget) {
      newErrors.budget = "Please select a budget range";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/leads", formData);

      setSuccess(response.data.message || "Thanks! Your request was submitted.");

      setFormData({
        name: "",
        email: "",
        budget: "",
        message: "",
      });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site">
      <header className="navbar">
        <div className="logo">
          LeadDesk<span>.</span>
        </div>

        <a href="#contact" className="nav-button">
          Get Started
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">LEAD MANAGEMENT MADE SIMPLE</p>

            <h1>
              Turn your next idea into something{" "}
              <span>remarkable.</span>
            </h1>

            <p className="hero-description">
              Tell us about your project and budget. Our team will review your
              requirements and get back to you.
            </p>

            <a href="#contact" className="primary-button">
              Start a Project
            </a>
          </div>

          <div className="hero-card">
            <div>
              <span className="card-number">01</span>
              <p>Tell us about your idea</p>
            </div>

            <div>
              <span className="card-number">02</span>
              <p>Choose your budget</p>
            </div>

            <div>
              <span className="card-number">03</span>
              <p>We'll get in touch</p>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-info">
            <p className="eyebrow">START A CONVERSATION</p>

            <h2>Have a project in mind?</h2>

            <p>
              Share a few details with us. We will review your request and
              contact you about the next steps.
            </p>
          </div>

          <form className="lead-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                maxLength="100"
              />

              {errors.name && (
                <span className="error">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && (
                <span className="error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget range</label>

              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select your budget</option>
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>

              {errors.budget && (
                <span className="error">{errors.budget}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Tell us about your project</label>

              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="What would you like us to build?"
                value={formData.message}
                onChange={handleChange}
                maxLength="1000"
              />

              {errors.message && (
                <span className="error">{errors.message}</span>
              )}
            </div>

            {success && <div className="success-message">{success}</div>}

            {serverError && (
              <div className="server-error">{serverError}</div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Project →"}
            </button>
          </form>
        </section>
      </main>

      <footer>
        <p>© 2026 LeadDesk Mini</p>

        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built for Digital Heroes Training Task
        </a>
      </footer>
    </div>
  );
}

export default Home;