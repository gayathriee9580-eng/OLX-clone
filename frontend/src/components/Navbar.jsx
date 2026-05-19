import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleBecomeSeller = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "https://olx-clone-vgy9.onrender.com/api/auth/update-role", 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("You are now a Seller! Redirecting to Add Product page...");
        const updatedUser = { ...user, role: "seller" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        navigate("/add-product");
        window.location.reload();
      }
    } catch (error) {
      console.log("Role update failed:", error);
      alert("Something went wrong!");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">OLX Clone</Link>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="nav-search"
      />

      <div className="nav-links">
        <Link to="/">Home</Link>

        {isLoggedIn && (
          <>
            {/* 👑 Admin ആണെങ്കിൽ കാണിക്കേണ്ട ലിങ്കുകൾ */}
            {user?.role === "admin" && (
              <>
                <Link to="/add-product">Sell</Link>
                <Link to="/admin/products" style={{ color: "#ffce00", fontWeight: "bold" }}>
                  Dashboard
                </Link>
              </>
            )}

            {/* 🛍️ Seller ആണെങ്കിൽ കാണിക്കേണ്ട ലിങ്കുകൾ */}
            {user?.role === "seller" && (
              <>
                <Link to="/add-product">Sell</Link>
                <Link to="/my-products">My Ads</Link>
              </>
            )}

            {/* 👤 Buyer ആണെങ്കിൽ കാണിക്കേണ്ട ബട്ടൺ */}
            {user?.role === "buyer" && (
              <button onClick={handleBecomeSeller} className="sell-btn" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                Sell
              </button> 
            )}
          </>
        )}

        {isLoggedIn ? (
          <button onClick={logout} className="logout-btn">Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;