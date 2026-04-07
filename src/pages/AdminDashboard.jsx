import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("rentals");
  const [rentals, setRentals] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    description: "",
    pricePerMonth: "",
    securityDeposit: "",
    stock: "",
  });

  // ── Fetch Data ──────────────────────────────────────────
  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await API.get("/rentals");
      setRentals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const res = await API.get("/maintenance");
      setMaintenance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "rentals") fetchRentals();
    if (activeTab === "maintenance") fetchMaintenance();
    if (activeTab === "products") fetchProducts();
  }, [activeTab]);

  // ── Maintenance ─────────────────────────────────────────
  const updateMaintenanceStatus = async (id, status) => {
    try {
      await API.put(`/maintenance/${id}`, { status });
      fetchMaintenance();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMaintenanceRequest = async (id) => {
    if (!window.confirm("Delete this maintenance request?")) return;
    try {
      await API.delete(`/maintenance/${id}`);
      fetchMaintenance();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Products ────────────────────────────────────────────
  const handleProductFormChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", category: "", description: "", pricePerMonth: "", securityDeposit: "", stock: "" });
    setShowProductForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      pricePerMonth: product.pricePerMonth,
      securityDeposit: product.securityDeposit || "",
      stock: product.stock || "",
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, productForm);
        alert("Product updated!");
      } else {
        await API.post("/products", productForm);
        alert("Product added!");
      }
      setShowProductForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Status Badge ────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const colors = {
      active: { bg: "#d4edda", color: "#155724" },
      returned: { bg: "#f8d7da", color: "#721c24" },
      Pending: { bg: "#fff3cd", color: "#856404" },
      Resolved: { bg: "#d4edda", color: "#155724" },
      "In Progress": { bg: "#cce5ff", color: "#004085" },
    };
    const c = colors[status] || { bg: "#eee", color: "#333" };
    return (
      <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", background: c.bg, color: c.color }}>
        {status}
      </span>
    );
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Admin Dashboard</h1>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <h3 style={styles.statNum}>{rentals.length}</h3>
          <p style={styles.statLabel}>Total Rentals</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNum}>{rentals.filter((r) => r.status === "active").length}</h3>
          <p style={styles.statLabel}>Active Rentals</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNum}>{maintenance.filter((m) => m.status === "Pending").length}</h3>
          <p style={styles.statLabel}>Pending Maintenance</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNum}>{products.length}</h3>
          <p style={styles.statLabel}>Total Products</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["rentals", "maintenance", "products"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
          >
            {tab === "rentals" ? "📋 Rentals" : tab === "maintenance" ? "🔧 Maintenance" : "📦 Products"}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <>
          {/* ── Rentals Tab ── */}
          {activeTab === "rentals" && (
            <div>
              <h2 style={styles.sectionTitle}>All Rentals</h2>
              {rentals.length === 0 ? <p>No rentals found.</p> : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Product</th>
                      <th style={styles.th}>Months</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Delivery Date</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.map((r) => (
                      <tr key={r._id} style={styles.tr}>
                        <td style={styles.td}>
                          <p style={{ margin: 0, fontWeight: "bold" }}>{r.user?.name}</p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{r.user?.email}</p>
                        </td>
                        <td style={styles.td}>{r.product?.name}</td>
                        <td style={styles.td}>{r.months}</td>
                        <td style={styles.td}>₹{r.totalPrice}</td>
                        <td style={styles.td}>
                          {r.deliveryDate ? new Date(r.deliveryDate).toLocaleDateString("en-IN") : "N/A"}
                        </td>
                        <td style={styles.td}><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── Maintenance Tab ── */}
          {activeTab === "maintenance" && (
            <div>
              <h2 style={styles.sectionTitle}>Maintenance Requests</h2>
              {maintenance.length === 0 ? <p>No requests found.</p> : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Product</th>
                      <th style={styles.th}>Issue</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map((m) => (
                      <tr key={m._id} style={styles.tr}>
                        <td style={styles.td}>
                          <p style={{ margin: 0, fontWeight: "bold" }}>{m.user?.name}</p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{m.user?.email}</p>
                        </td>
                        <td style={styles.td}>{m.product?.name}</td>
                        <td style={styles.td}>{m.issue}</td>
                        <td style={styles.td}><StatusBadge status={m.status} /></td>
                        <td style={styles.td}>
                          <select
                            value={m.status}
                            onChange={(e) => updateMaintenanceStatus(m._id, e.target.value)}
                            style={styles.select}
                          >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                          </select>
                          <button
                            onClick={() => deleteMaintenanceRequest(m._id)}
                            style={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── Products Tab ── */}
          {activeTab === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={styles.sectionTitle}>Manage Products</h2>
                <button onClick={openAddProduct} style={styles.addBtn}>+ Add Product</button>
              </div>

              {/* Product Form */}
              {showProductForm && (
                <div style={styles.formCard}>
                  <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                  <form onSubmit={handleProductSubmit}>
                    <div style={styles.formGrid}>
                      {[
                        { label: "Name", name: "name", type: "text" },
                        { label: "Category", name: "category", type: "text" },
                        { label: "Price/Month (₹)", name: "pricePerMonth", type: "number" },
                        { label: "Security Deposit (₹)", name: "securityDeposit", type: "number" },
                        { label: "Stock", name: "stock", type: "number" },
                      ].map((field) => (
                        <div key={field.name} style={styles.field}>
                          <label style={styles.label}>{field.label}</label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={productForm[field.name]}
                            onChange={handleProductFormChange}
                            required
                            style={styles.input}
                          />
                        </div>
                      ))}
                      <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                        <label style={styles.label}>Description</label>
                        <textarea
                          name="description"
                          value={productForm.description}
                          onChange={handleProductFormChange}
                          rows={2}
                          style={{ ...styles.input, resize: "none" }}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <button type="submit" style={styles.addBtn}>
                        {editingProduct ? "Update Product" : "Add Product"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        style={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              {products.length === 0 ? <p>No products found.</p> : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Price/Month</th>
                      <th style={styles.th}>Security Deposit</th>
                      <th style={styles.th}>Stock</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} style={styles.tr}>
                        <td style={styles.td}>{p.name}</td>
                        <td style={styles.td}>{p.category}</td>
                        <td style={styles.td}>₹{p.pricePerMonth}</td>
                        <td style={styles.td}>₹{p.securityDeposit || "N/A"}</td>
                        <td style={styles.td}>{p.stock || "N/A"}</td>
                        <td style={styles.td}>
                          <button onClick={() => openEditProduct(p)} style={styles.editBtn}>Edit</button>
                          <button onClick={() => deleteProduct(p._id)} style={styles.deleteBtn}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "1100px", margin: "40px auto", padding: "0 20px" },
  title: { fontSize: "28px", marginBottom: "24px" },
  statsBar: { display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" },
  statCard: {
    flex: 1, minWidth: "150px", background: "#fff", border: "1px solid #e0e0e0",
    borderRadius: "12px", padding: "20px", textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  statNum: { fontSize: "32px", margin: "0 0 4px", color: "#007bff" },
  statLabel: { margin: 0, color: "#888", fontSize: "13px" },
  tabs: { display: "flex", gap: "8px", marginBottom: "24px" },
  tab: {
    padding: "10px 20px", border: "1px solid #ddd", borderRadius: "8px",
    background: "#f8f9fa", cursor: "pointer", fontSize: "14px",
  },
  activeTab: { background: "#007bff", color: "#fff", border: "1px solid #007bff" },
  sectionTitle: { fontSize: "18px", marginBottom: "16px", color: "#333" },
  loading: { textAlign: "center", color: "#888", marginTop: "40px" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  thead: { background: "#f8f9fa" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "13px", color: "#555", fontWeight: "600", borderBottom: "1px solid #eee" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#333", verticalAlign: "middle" },
  select: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", marginRight: "8px" },
  deleteBtn: { padding: "6px 12px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  editBtn: { padding: "6px 12px", background: "#ffc107", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", marginRight: "8px" },
  addBtn: { padding: "10px 18px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  cancelBtn: { padding: "10px 18px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
  formCard: { background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "12px", padding: "20px", marginBottom: "24px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  field: { display: "flex", flexDirection: "column" },
  label: { fontSize: "13px", marginBottom: "4px", color: "#555" },
  input: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
};

export default AdminDashboard;