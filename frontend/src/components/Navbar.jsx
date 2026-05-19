import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // 🚀 ഇമ്പോർട്ട് ചെയ്യുക

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
        // ✨ പഴയ അലർട്ടിന് പകരം പ്രൊഫഷണൽ SweetAlert പോപ്പ്-അപ്പ്
        Swal.fire({
          title: "🎉 Congratulations!",
          text: "You are now a Seller! Redirecting to Add Product page...",
          icon: "success",
          background: "#1e293b", // നിന്റെ സൈറ്റിന്റെ ഡാർക്ക് തീമിന് മാച്ചാവാൻ
          color: "#fff",
          confirmButtonColor: "#2563eb",
          timer: 2500,
          showConfirmButton: false
        });

        const updatedUser = { ...user, role: "seller" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setTimeout(() => {
          navigate("/add-product");
          window.location.reload();
        }, 2500);
      }
    } catch (error) {
      console.log("Role update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Make sure backend is updated.",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#dc2626"
      });
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
            {user?.role === "admin" && (
              <Link to="/admin/products" style={{ color: "#ffce00", fontWeight: "bold" }}>
                Dashboard
              </Link>
            )}

            {user?.role === "seller" && (
              <>
                <Link to="/add-product">Sell</Link>
                <Link to="/my-products">My Ads</Link>
              </>
            )}

            {user?.role === "buyer" && (
              <button 
                onClick={handleBecomeSeller} 
                className="sell-btn" 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: '0 10px' }}
              >
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