import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const TENURE_OPTIONS = [1, 3, 6, 12];

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    pincode: "",
    deliveryDate: "",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validations
  const validate = () => {
    if (!formData.address.trim()) return "Address is required.";
    if (!formData.city.trim()) return "City is required.";
    if (!/^[0-9]{6}$/.test(formData.pincode)) return "Enter a valid 6-digit pincode.";
    if (!formData.deliveryDate) return "Please select a delivery date.";
    return null;
  };

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.product?.pricePerMonth * item.months, 0
  );

  const totalDeposit = cartItems.reduce(
    (sum, item) => sum + (item.product?.securityDeposit || 0), 0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError("");
    setLoading(true);
    try {
      for (const item of cartItems) {
        await API.post("/rentals", {
          product: item.product._id,
          months: item.months,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          deliveryDate: formData.deliveryDate,
          totalPrice: item.product.pricePerMonth * item.months,
        });
      }
      await API.delete("/cart");
      alert("Order placed successfully! 🎉");
      navigate("/my-rentals");
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📦 Checkout</h1>

      <div style={styles.layout}>
        {/* Left — Delivery Form */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Delivery Details</h2>
          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Full Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House no, Street, Area"
                required
                rows={3}
                style={{ ...styles.input, resize: "none" }}
              />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  required
                  style={styles.input}
                />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  maxLength={6}
                  required
                  style={styles.input}
                />
                {formData.pincode && !/^[0-9]{6}$/.test(formData.pincode) && (
                  <span style={styles.fieldError}>Enter valid 6-digit pincode</span>
                )}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Preferred Delivery Date *</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                min={minDate}
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Placing Order..." : `Place Order — ₹${grandTotal}`}
            </button>
          </form>
        </div>

        {/* Right — Order Summary */}
        <div style={styles.summarySection}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item._id} style={styles.summaryItem}>
              <div>
                <p style={styles.itemName}>{item.product?.name}</p>
                <p style={styles.itemDetail}>{item.months} month(s)</p>
              </div>
              <p style={styles.itemPrice}>₹{item.product?.pricePerMonth * item.months}</p>
            </div>
          ))}

          <div style={styles.divider} />

          <div style={styles.summaryRow}>
            <span>Rental Total</span>
            <span>₹{grandTotal}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={{ color: "#ff8c00" }}>Security Deposit</span>
            <span style={{ color: "#ff8c00" }}>₹{totalDeposit}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.grandTotal}>
            <span>Amount Payable</span>
            <span>₹{grandTotal + totalDeposit}</span>
          </div>

          <p style={styles.depositNote}>
            * Security deposit is refundable upon return of products in good condition.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "40px auto", padding: "0 20px" },
  title: { fontSize: "28px", marginBottom: "24px" },
  layout: { display: "flex", gap: "24px", flexWrap: "wrap" },
  formSection: { flex: 2, minWidth: "300px" },
  summarySection: {
    flex: 1, minWidth: "250px", background: "#f8f9fa",
    borderRadius: "12px", padding: "20px", alignSelf: "flex-start",
  },
  sectionTitle: { fontSize: "18px", marginBottom: "16px", color: "#333" },
  error: {
    background: "#ffe5e5", color: "#cc0000", padding: "10px",
    borderRadius: "6px", marginBottom: "16px", fontSize: "14px",
  },
  fieldError: { color: "#cc0000", fontSize: "12px", marginTop: "4px" },
  field: { marginBottom: "16px" },
  row: { display: "flex", gap: "12px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", color: "#333" },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: "6px",
    border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%", padding: "14px", background: "#007bff", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", marginTop: "8px",
  },
  summaryItem: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "12px",
  },
  itemName: { margin: 0, fontWeight: "bold", fontSize: "14px" },
  itemDetail: { margin: "2px 0 0", fontSize: "12px", color: "#888" },
  itemPrice: { margin: 0, fontWeight: "bold" },
  divider: { borderTop: "1px solid #ddd", margin: "12px 0" },
  summaryRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "14px", marginBottom: "8px",
  },
  grandTotal: {
    display: "flex", justifyContent: "space-between",
    fontWeight: "bold", fontSize: "18px",
  },
  depositNote: {
    marginTop: "12px", fontSize: "11px", color: "#999", lineHeight: "1.5",
  },
};

export default Checkout;