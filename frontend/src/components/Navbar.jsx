import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ സാധാരണ ടോക്കണോ അതോ അഡ്മിൻ ടോക്കണോ ഉണ്ടോ എന്ന് നോക്കുന്നു
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData)); // സ്ട്രിങ് ഡാറ്റ ഒബ്ജക്റ്റ് ആക്കുന്നു
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const logout = () => {
    // ✅ എല്ലാ ടോക്കണുകളും യൂസർ ഡാറ്റയും കളയുന്നു
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
    
    // 🚀 സ്റ്റേറ്റ് ക്ലിയർ ആയി പേജ് ഫ്രഷ് ആകാൻ വേണ്ടി
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

        {/* ✅ ലോഗിൻ ചെയ്ത യൂസർക്ക് മാത്രം കാണിക്കേണ്ടത് */}
        {isLoggedIn && (
          <>
            {/* അഡ്മിൻ ആണെങ്കിൽ അഡ്മിൻ ലിങ്ക് മാത്രം കാണിക്കുക, അല്ലെങ്കിൽ Sell കാണിക്കുക */}
            {user?.role === "admin" ? (
              <Link to="/admin/products" style={{ color: "#ffce00", fontWeight: "bold" }}>Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/add-product">Sell</Link> {/* 👈 App.jsx-ൽ ഉള്ള റൂട്ട് '/add-product' ആണ് */}
                <Link to="/my-products">My Ads</Link>
              </>
            )}
          </>
        )}

        {/* ✅ ലോഗിൻ സ്റ്റേറ്റ് അനുസരിച്ച് ബട്ടൺ മാറുന്നു */}
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