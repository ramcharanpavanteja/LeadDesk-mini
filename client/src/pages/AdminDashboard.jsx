import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const response = await api.get("/api/leads");

        setLeads(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/admin/login");
          return;
        }

        setError("Unable to load leads.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [navigate]);

  // Update lead status
  const updateStatus = async (leadId, status) => {
    try {
      setError("");

      const response = await api.patch(
        `/api/leads/${leadId}/status`,
        { status }
      );

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead._id === leadId ? response.data.lead : lead
        )
      );
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/admin/login");
        return;
      }

      setError("Unable to update lead status.");
    }
  };

  // Logout admin
  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/admin/login");
    }
  };

  // Search
  const filteredLeads = leads.filter((lead) => {
    const query = search.toLowerCase();

    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.message.toLowerCase().includes(query) ||
      lead.status.toLowerCase().includes(query)
    );
  });

  const newCount = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contactedCount = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const closedCount = leads.filter(
    (lead) => lead.status === "Closed"
  ).length;

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading leads...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <div className="logo">
            LeadDesk<span>.</span>
          </div>

          <p>Lead Management Dashboard</p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-title">
          <div>
            <p className="eyebrow">
              ADMIN DASHBOARD
            </p>

            <h1>Leads</h1>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Search name, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Leads</span>
            <strong>{leads.length}</strong>
          </div>

          <div className="stat-card">
            <span>New</span>
            <strong>{newCount}</strong>
          </div>

          <div className="stat-card">
            <span>Contacted</span>
            <strong>{contactedCount}</strong>
          </div>

          <div className="stat-card">
            <span>Closed</span>
            <strong>{closedCount}</strong>
          </div>
        </div>

        {error && (
          <div className="server-error">
            {error}
          </div>
        )}

        <div className="leads-table-container">
          {filteredLeads.length === 0 ? (
            <div className="empty-state">
              <h3>No leads found</h3>

              <p>
                {search
                  ? "Try another search."
                  : "New leads will appear here."}
              </p>
            </div>
          ) : (
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Budget</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <strong>{lead.name}</strong>
                      <span>{lead.email}</span>
                    </td>

                    <td>{lead.budget}</td>

                    <td className="message-cell">
                      {lead.message}
                    </td>

                    <td>
                      {new Date(
                        lead.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <select
                        className={`status-select status-${lead.status.toLowerCase()}`}
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(
                            lead._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="New">
                          New
                        </option>

                        <option value="Contacted">
                          Contacted
                        </option>

                        <option value="Closed">
                          Closed
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;