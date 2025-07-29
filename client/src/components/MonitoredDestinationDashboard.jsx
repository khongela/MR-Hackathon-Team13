import { useState, useEffect } from "react";
import "./AlertsDashboard.css"; // reuse styles

const MonitoredDestinationDashboard = () => {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({ location: "", riskLevel: "", lastChecked: "" });
  const [editId, setEditId] = useState(null); // null = create mode

  const fetchDestinations = async () => {
    const res = await fetch("http://localhost:3500/api/v1/monitored-destinations");
    const data = await res.json();
    setDestinations(data.data || []);
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `http://localhost:3500/api/v1/monitored-destinations/${editId}`
      : "http://localhost:3500/api/v1/monitored-destinations";

    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      await fetchDestinations();
      setFormData({ location: "", riskLevel: "", lastChecked: "" });
      setEditId(null);
    }
  };

  const handleEdit = (dest) => {
    setFormData({
      location: dest.location,
      riskLevel: dest.riskLevel,
      lastChecked: new Date(dest.lastChecked).toISOString().slice(0, 16) // for datetime-local input
    });
    setEditId(dest.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      await fetch(`http://localhost:3500/api/v1/monitored-destinations/${id}`, {
        method: "DELETE",
      });
      await fetchDestinations();
    }
  };

  return (
    <div className="alerts-container">
      <h3>Monitored Destinations</h3>

      {/* Form */}
      <form className="alerts-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <select name="riskLevel" value={formData.riskLevel} onChange={handleChange} required>
          <option value="">Select Risk</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <input
          type="datetime-local"
          name="lastChecked"
          value={formData.lastChecked}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      {/* List */}
      <div className="alerts-list">
        {destinations.map((d) => (
          <div key={d.id} className={`alert-card severity-${d.riskLevel?.toLowerCase()}`}>
            <div className="alert-content">
              <div>
                <h4>{d.location}</h4>
                <div className="tag-group">
                  <span className={`tag severity-tag-${d.riskLevel?.toLowerCase()}`}>
                    {d.riskLevel}
                  </span>
                </div>
                <div className="alert-timestamp">
                  <svg className="clock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(d.lastChecked).toLocaleString()}
                </div>
              </div>
              <div className="alert-actions">
                <button className="btn-alert btn-monitor" onClick={() => handleEdit(d)}>Edit</button>
                <button className="btn-alert btn-resolve" onClick={() => handleDelete(d.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitoredDestinationDashboard;
