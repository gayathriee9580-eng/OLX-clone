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
        "http://localhost:5000/api/auth/login",
        form
      );

            if (res.data.user.role === "admin") {
            localStorage.setItem("adminToken", res.data.token);
            } else {
            localStorage.setItem("token", res.data.token);
            }
            
      alert("Login Success");
      navigate("/");
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