import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, []);

  const removeItem = async (cartItemId) => {
    try {
      await API.delete(`/cart/${cartItemId}`);
      setCartItems(cartItems.filter((item) => item._id !== cartItemId));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.product?.pricePerMonth * item.months,
    0
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 My Cart</h1>

      {cartItems.length === 0 ? (
        <p style={styles.empty}>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} style={styles.card}>
              <div>
                <h3 style={styles.productName}>{item.product?.name}</h3>
                <p style={styles.detail}>Duration: {item.months} month(s)</p>
                <p style={styles.detail}>₹{item.product?.pricePerMonth}/month</p>
                <p style={styles.total}>
                  Subtotal: ₹{item.product?.pricePerMonth * item.months}
                </p>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}

          <div style={styles.summary}>
            <h3>Grand Total: ₹{grandTotal}</h3>
            <button
              onClick={() => navigate("/checkout")}
              style={styles.checkoutBtn}
            >
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "40px auto", padding: "0 20px" },
  title: { fontSize: "28px", marginBottom: "20px" },
  empty: { color: "#888", fontSize: "16px" },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "12px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  productName: { margin: "0 0 6px", fontSize: "18px" },
  detail: { margin: "2px 0", color: "#555", fontSize: "14px" },
  total: { margin: "6px 0 0", fontWeight: "bold", color: "#333" },
  removeBtn: {
    padding: "8px 14px",
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  summary: {
    marginTop: "24px",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "10px",
    textAlign: "right",
  },
  checkoutBtn: {
    marginTop: "12px",
    padding: "12px 24px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Cart;