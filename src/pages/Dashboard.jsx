import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>🏠 RentEase</h2>

        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/cart" style={styles.navLink}>🛒 Cart</Link>
          <Link to="/my-rentals" style={styles.navLink}>📦 My Rentals</Link>
          <Link to="/maintenance" style={styles.navLink}>🔧 Maintenance</Link>
          <Link to="/admin" style={styles.navLink}>⚙️ Admin</Link>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </nav>

      {/* ── Main Content ── */}
      <div style={styles.content}>
        <h1 style={styles.title}>Browse Products</h1>
        <p style={styles.subtitle}>Rent furniture & appliances at affordable monthly prices</p>

        {products.length === 0 ? (
          <p style={styles.empty}>No products found.</p>
        ) : (
          <div style={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 32px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: { margin: 0, fontSize: "20px", color: "#007bff" },
  navLinks: { display: "flex", gap: "20px", alignItems: "center" },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "14px",
    fontWeight: "500",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "background 0.2s",
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: { maxWidth: "1100px", margin: "0 auto", padding: "32px 20px" },
  title: { fontSize: "26px", marginBottom: "6px" },
  subtitle: { color: "#888", marginBottom: "28px", fontSize: "15px" },
  empty: { color: "#888", textAlign: "center", marginTop: "60px" },
  grid: { display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" },
};

export default Dashboard;