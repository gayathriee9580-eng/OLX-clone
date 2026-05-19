import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; // 🚀 axios ഇമ്പോർട്ട് ചെയ്തു

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

  // 🔥 ബയറെ സെല്ലർ ആക്കി മാറ്റാനുള്ള ഫങ്ക്ഷൻ
  const handleBecomeSeller = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // 🔑 ബാക്ക്എൻഡിലെ പുതിയ PUT റൂട്ടിലേക്ക് റിക്വസ്റ്റ് അയക്കുന്നു
      const res = await axios.put(
        "https://olx-clone-vgy9.onrender.com/api/auth/update-role", 
        {}, // authMiddleware ഉള്ളതുകൊണ്ട് ബോഡി ശൂന്യമായി വിടാം
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("You are now a Seller! Redirecting to Add Product page...");
        
        // 1. ലോക്കൽ സ്റ്റോറേജിലെ യൂസർ റോൾ അപ്ഡേറ്റ് ചെയ്യുക
        const updatedUser = { ...user, role: "seller" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // 2. സ്റ്റേറ്റ് അപ്ഡേറ്റ് ചെയ്യുക
        setUser(updatedUser);

        // 3. പ്രൊഡക്ട് ആഡ് ചെയ്യുന്ന പേജിലേക്ക് വിടുക
        navigate("/add-product");
        window.location.reload(); // നവ്ബാർ പെട്ടെന്ന് അപ്ഡേറ്റ് ആകാൻ
      }
    } catch (error) {
      console.log("Role update failed:", error);
      alert("Something went wrong! Make sure backend is updated.");
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
      <Link to="/" className="logo">
        OLX Clone
      </Link>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="nav-search"
      />

      <div className="nav-links">
        <Link to="/">Home</Link>

        {/* ✅ ലോഗിൻ ചെയ്തവർക്ക് റോളുകൾ അനുസരിച്ച് ലിങ്കുകൾ മാറ്റുന്നു */}
        {isLoggedIn && (
          <>
            {user?.role === "admin" && (
              <Link to="/admin/products" style={{ color: "#ffce00", fontWeight: "bold" }}>
                Admin Dashboard
              </Link>
            )}

            {/* ✅ യൂസർ റോൾ 'seller' ആണെങ്കിൽ മാത്രം Sell ഉം My Ads ഉം കാണിക്കുക */}
            {user?.role === "seller" && (
              <>
                <Link to="/add-product">Sell</Link>
                <Link to="/my-products">My Ads</Link>
              </>
            )}

            {/* ✅ യൂസർ റോൾ 'buyer' ആണെങ്കിൽ ലിങ്കിന് പകരം ഫങ്ക്ഷൻ വിളിക്കുന്ന ബട്ടൺ കൊടുക്കുന്നു */}
            {user?.role === "buyer" && (
              <button 
                onClick={handleBecomeSeller} 
                className="sell-btn"
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "inherit"
                }}
              >
                Sell
              </button> 
            )}
          </>
        )}

        {/* ✅ ലോഗിൻ അനുсരിച്ച് ബട്ടൺ മാറ്റുന്നു */}
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