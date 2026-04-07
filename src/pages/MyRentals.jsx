import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRentals = async () => {
    try {
      const res = await API.get("/rentals/my-rentals");
      setRentals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const returnProduct = async (id) => {
    if (!window.confirm("Are you sure you want to return this product?")) return;
    try {
      await API.put(`/rentals/return/${id}`);
      alert("Product returned successfully!");
      fetchRentals();
    } catch (err) {
      console.error(err);
      alert("Failed to return product. Try again.");
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const activeRentals = rentals.filter((r) => r.status === "active");
  const returnedRentals = rentals.filter((r) => r.status === "returned");

  const statusStyle = (status) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    background: status === "active" ? "#d4edda" : "#f8d7da",
    color: status === "active" ? "#155724" : "#721c24",
  });

  const RentalCard = ({ rental }) => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.productName}>{rental.product?.name}</h3>
        <span style={statusStyle(rental.status)}>
          {rental.status === "active" ? "🟢 Active" : "🔴 Returned"}
        </span>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Duration</span>
            <span style={styles.infoValue}>{rental.months} month(s)</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Total Price</span>
            <span style={styles.infoValue}>₹{rental.totalPrice}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Start Date</span>
            <span style={styles.infoValue}>
              {new Date(rental.startDate).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>End Date</span>
            <span style={styles.infoValue}>
              {new Date(rental.endDate).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Delivery Date</span>
            <span style={styles.infoValue}>
              {rental.deliveryDate
                ? new Date(rental.deliveryDate).toLocaleDateString("en-IN")
                : "N/A"}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Delivery Address</span>
            <span style={styles.infoValue}>
              {rental.address ? `${rental.address}, ${rental.city} - ${rental.pincode}` : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {rental.status === "active" && (
        <div style={styles.cardFooter}>
          <button
            onClick={() => returnProduct(rental._id)}
            style={styles.returnBtn}
          >
            Return Product
          </button>
        </div>
      )}
    </div>
  );

  if (loading) return <p style={styles.loading}>Loading your rentals...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 My Rentals</h1>
        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </div>

      {rentals.length === 0 ? (
        <div style={styles.empty}>
          <p>You have no rentals yet.</p>
          <button onClick={() => navigate("/dashboard")} style={styles.browseBtn}>
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {activeRentals.length > 0 && (
            <section>
              <h2 style={styles.sectionTitle}>Active Rentals ({activeRentals.length})</h2>
              {activeRentals.map((rental) => (
                <RentalCard key={rental._id} rental={rental} />
              ))}
            </section>
          )}

          {returnedRentals.length > 0 && (
            <section style={{ marginTop: "32px" }}>
              <h2 style={styles.sectionTitle}>Rental History ({returnedRentals.length})</h2>
              {returnedRentals.map((rental) => (
                <RentalCard key={rental._id} rental={rental} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px", margin: "40px auto", padding: "0 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "28px", margin: 0 },
  backBtn: {
    padding: "8px 16px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  sectionTitle: { fontSize: "18px", color: "#555", marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "8px" },
  card: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0",
    background: "#fafafa",
  },
  productName: { margin: 0, fontSize: "18px" },
  cardBody: { padding: "16px 20px" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  infoItem: { display: "flex", flexDirection: "column" },
  infoLabel: { fontSize: "11px", color: "#999", textTransform: "uppercase", marginBottom: "2px" },
  infoValue: { fontSize: "14px", color: "#333", fontWeight: "500" },
  cardFooter: { padding: "12px 20px", borderTop: "1px solid #f0f0f0", textAlign: "right" },
  returnBtn: {
    padding: "8px 18px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  empty: { textAlign: "center", padding: "60px 0", color: "#888" },
  browseBtn: {
    marginTop: "12px",
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  loading: { textAlign: "center", marginTop: "60px", color: "#888" },
};

export default MyRentals;