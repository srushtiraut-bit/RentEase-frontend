import React, { useState } from "react";
import API from "../api/axiosConfig";

const TENURE_OPTIONS = [1, 3, 6, 12];

const ProductCard = ({ product }) => {
  const [months, setMonths] = useState(1);

  const addToCart = async () => {
    try {
      await API.post("/cart/add", {
        productId: product._id,
        months,
      });
      alert("Added to cart!");
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart. Please login first.");
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.categoryBadge}>{product.category}</div>
      <h3 style={styles.name}>{product.name}</h3>
      <p style={styles.description}>{product.description}</p>

      <div style={styles.priceRow}>
        <div>
          <p style={styles.priceLabel}>Monthly Rent</p>
          <p style={styles.price}>₹{product.pricePerMonth}/mo</p>
        </div>
        <div>
          <p style={styles.priceLabel}>Security Deposit</p>
          <p style={styles.deposit}>₹{product.securityDeposit || "N/A"}</p>
        </div>
      </div>

      <div style={styles.tenureRow}>
        <label style={styles.label}>Rental Tenure</label>
        <div style={styles.tenureOptions}>
          {TENURE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setMonths(option)}
              style={{
                ...styles.tenureBtn,
                ...(months === option ? styles.tenureBtnActive : {}),
              }}
            >
              {option}mo
            </button>
          ))}
        </div>
      </div>

      <div style={styles.totalRow}>
        <span style={styles.totalLabel}>Total</span>
        <span style={styles.totalPrice}>₹{product.pricePerMonth * months}</span>
      </div>

      <button onClick={addToCart} style={styles.addBtn}>
        Add to Cart 🛒
      </button>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    margin: "10px",
    width: "260px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "3px 10px",
    background: "#e8f0fe",
    color: "#1a73e8",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    alignSelf: "flex-start",
  },
  name: { margin: 0, fontSize: "18px", color: "#1a1a1a" },
  description: { margin: 0, fontSize: "13px", color: "#888", lineHeight: "1.4" },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f8f9fa",
    borderRadius: "8px",
    padding: "10px 14px",
  },
  priceLabel: { margin: "0 0 2px", fontSize: "11px", color: "#999" },
  price: { margin: 0, fontWeight: "bold", fontSize: "16px", color: "#007bff" },
  deposit: { margin: 0, fontWeight: "bold", fontSize: "16px", color: "#ff8c00" },
  tenureRow: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", color: "#555" },
  tenureOptions: { display: "flex", gap: "6px" },
  tenureBtn: {
    flex: 1,
    padding: "6px 0",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#f8f9fa",
    cursor: "pointer",
    fontSize: "13px",
    color: "#333",
  },
  tenureBtnActive: {
    background: "#007bff",
    color: "#fff",
    border: "1px solid #007bff",
    fontWeight: "bold",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "8px",
  },
  totalLabel: { fontSize: "13px", color: "#555" },
  totalPrice: { fontWeight: "bold", fontSize: "18px", color: "#28a745" },
  addBtn: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "4px",
  },
};

export default ProductCard;