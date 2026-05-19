import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

            {/* ✅ യൂസർ റോൾ 'buyer' ആണെങ്കിൽ 'Sell' പ്ലാൻ ചെയ്യാം (അല്ലെങ്കിൽ വെറും ഹോം മാത്രം മതി) */}
            {user?.role === "buyer" && (
              <Link to="/add-product">Sell</Link> 
            )}
          </>
        )}

        {/* ✅ ലോഗിൻ അനുസരിച്ച് ബട്ടൺ മാറ്റുന്നു */}
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