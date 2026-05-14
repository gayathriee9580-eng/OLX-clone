import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    setIsLoggedIn(!!token);
    setUser(userData);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    navigate("/login");
  };

return (
  <nav className="navbar">
    <Link to="/" className="logo">
      OLX Clone
    </Link>

    {/* 🔍 ADD HERE */}
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
          <Link to="/create">Sell</Link>
          <Link to="/my-products">My Ads</Link>

          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}
        </>
      )}

      {isLoggedIn ? (
        <button onClick={logout}>Logout</button>
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