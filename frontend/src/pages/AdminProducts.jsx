import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // 'products' അല്ലെങ്കിൽ 'users'

  const adminToken = localStorage.getItem("adminToken") || localStorage.getItem("token");

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/300x200?text=No+Image";
    if (image.startsWith("http")) return image;
    return `https://olx-clone-vgy9.onrender.com/uploads/${image}`;
  };

  const fetchAdminProducts = async () => {
    try {
      const res = await axios.get("https://olx-clone-vgy9.onrender.com/api/admin/products", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://olx-clone-vgy9.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`https://olx-clone-vgy9.onrender.com/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      alert("Product Deleted");
      fetchAdminProducts();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const toggleBlockUser = async (userId) => {
    try {
      await axios.patch(`https://olx-clone-vgy9.onrender.com/api/admin/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchUsers();
    } catch (error) {
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetchAdminProducts();
    fetchUsers();
  }, []);

  return (
    <div className="admin-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", color: "white" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#6366f1" }}>Admin Dashboard</h1>
      
      {/* 📑 Tabs Navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "30px" }}>
        <button 
          onClick={() => setActiveTab("products")}
          style={{ padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", background: activeTab === "products" ? "#2563eb" : "#374151", color: "white", fontWeight: "bold" }}
        >
          Manage Listings ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          style={{ padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", background: activeTab === "users" ? "#2563eb" : "#374151", color: "white", fontWeight: "bold" }}
        >
          Manage Users ({users.length})
        </button>
      </div>

      {/* 🛍️ Products Management */}
      {activeTab === "products" && (
        <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {products.map((product) => (
            <div className="product-card" key={product._id} style={{ background: "#1e293b", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              <img src={getImageUrl(product.image)} alt={product.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div className="product-info" style={{ padding: "15px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>{product.title}</h3>
                  <p style={{ color: "#9ca3af", fontSize: "0.9rem", height: "40px", overflow: "hidden" }}>{product.description}</p>
                  <h4 className="price" style={{ color: "#10b981", margin: "10px 0" }}>₹ {product.price}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>📍 {product.location}</p>
                  <p style={{ fontSize: "0.85rem", color: "#ffce00", marginTop: "5px" }}>👤 Seller: {product.seller?.name || "Admin"}</p>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <Link to={`/admin/edit-product/${product._id}`} style={{ flex: 1 }}>
                    <button style={{ width: "100%", padding: "8px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                  </Link>
                  <button onClick={() => deleteProduct(product._id)} style={{ flex: 1, padding: "8px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 👥 Users Management (Sellers & Buyers) */}
      {activeTab === "users" && (
        <div style={{ overflowX: "auto", background: "#1e293b", borderRadius: "12px", padding: "15px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #374151", color: "#9ca3af" }}>
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Role</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #374151", background: user.isBlocked ? "#311c1c" : "transparent" }}>
                  <td style={{ padding: "12px" }}>{user.name}</td>
                  <td style={{ padding: "12px" }}>{user.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold", background: user.role === "admin" ? "#pffce00" : user.role === "seller" ? "#059669" : "#4b5563", color: "white" }}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: user.isBlocked ? "#ef4444" : "#10b981" }}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {user.role !== "admin" ? (
                      <button 
                        onClick={() => toggleBlockUser(user._id)}
                        style={{ padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", background: user.isBlocked ? "#10b981" : "#dc2626", color: "white", fontWeight: "bold" }}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>No Action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;