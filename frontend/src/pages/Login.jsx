import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://olx-clone-vgy9.onrender.com/api/auth/login",
        form
      );

      alert("Login Success");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "admin") {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/products");
      } else {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
      window.location.reload();

    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <div className="app">
      <form onSubmit={loginUser} className="product-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Login</button>
        <p>
        <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;