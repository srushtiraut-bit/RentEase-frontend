import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Maintenance = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [formData, setFormData] = useState({ product: "", issue: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, requestsRes] = await Promise.all([
          API.get("/products"),
          API.get("/maintenance/my-requests"),
        ]);
        setProducts(productsRes.data);
        setMyRequests(requestsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/maintenance/my-requests");
      setMyRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await API.post("/maintenance", formData);
      setSuccess("Maintenance request submitted successfully!");
      setFormData({ product: "", issue: "" });
      fetchMyRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = (status) => {
    const colors = {
      Pending: { bg: "#fff3cd", color: "#856404" },
      "In Progress": { bg: "#cce5ff", color: "#004085" },
      Resolved: { bg: "#d4edda", color: "#155724" },
    };
    const c = colors[status] || { bg: "#eee", color: "#333" };
    return {
      padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
      fontWeight: "bold", background: c.bg, color: c.color,
    };
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>🏠 RentEase</h2>
        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </nav>

      <div style={styles.container}>
        <h1 style={styles.title}>🔧 Maintenance Requests</h1>

        <div style={styles.layout}>

          {/* ── Submit Form ── */}
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>Submit a Request</h2>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.successMsg}>{success}</p>}

            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Select Product</label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">-- Select a product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Describe the Issue</label>
                <textarea
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  placeholder="e.g. The washing machine is making a loud noise..."
                  required
                  rows={4}
                  style={{ ...styles.input, resize: "none" }}
                />
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>

          {/* ── My Requests ── */}
          <div style={styles.requestsSection}>
            <h2 style={styles.sectionTitle}>My Requests</h2>

            {myRequests.length === 0 ? (
              <p style={{ color: "#888" }}>No requests submitted yet.</p>
            ) : (
              myRequests.map((req) => (
                <div key={req._id} style={styles.requestCard}>
                  <div style={styles.requestHeader}>
                    <p style={styles.productName}>{req.product?.name}</p>
                    <span style={statusStyle(req.status)}>{req.status}</span>
                  </div>
                  <p style={styles.issueText}>{req.issue}</p>
                  <p style={styles.dateText}>
                    {new Date(req.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 32px", background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  logo: { margin: 0, fontSize: "20px", color: "#007bff" },
  backBtn: {
    padding: "8px 16px", background: "#f0f0f0", border: "none",
    borderRadius: "6px", cursor: "pointer", fontSize: "14px",
  },
  container: { maxWidth: "900px", margin: "40px auto", padding: "0 20px" },
  title: { fontSize: "28px", marginBottom: "24px" },
  layout: { display: "flex", gap: "24px", flexWrap: "wrap" },
  formSection: { flex: 1, minWidth: "280px", background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  requestsSection: { flex: 1, minWidth: "280px" },
  sectionTitle: { fontSize: "18px", marginBottom: "16px", color: "#333" },
  error: { background: "#ffe5e5", color: "#cc0000", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
  successMsg: { background: "#d4edda", color: "#155724", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
  field: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", color: "#333" },
  input: { width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  submitBtn: { width: "100%", padding: "12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  requestCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px", marginBottom: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" },
  requestHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  productName: { margin: 0, fontWeight: "bold", fontSize: "15px" },
  issueText: { margin: "4px 0", fontSize: "14px", color: "#555" },
  dateText: { margin: 0, fontSize: "12px", color: "#aaa" },
};

export default Maintenance;