import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // 🚀 SweetAlert ഇമ്പോർട്ട് ചെയ്തു

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

      // 💾 യൂസർ ഡാറ്റ ലോക്കൽ സ്റ്റോറേജിൽ സേവ് ചെയ്യുന്നു
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔑 ടോക്കൺ റോൾ അനുസരിച്ച് വേർതിരിച്ച് സേവ് ചെയ്യുന്നു
      if (res.data.user.role === "admin") {
        localStorage.setItem("adminToken", res.data.token);
      } else {
        localStorage.setItem("token", res.data.token);
      }

      // ✨ പ്രൊഫഷണൽ SweetAlert ലോഗിൻ സക്സസ് മെസ്സേജ്
      if (typeof Swal !== "undefined" && Swal.fire) {
        Swal.fire({
          title: "🔑 Login Successful!",
          text: `Welcome back, ${res.data.user.name || "User"}!`,
          icon: "success",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#2563eb",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        alert("Login Success");
      }

      // 🚀 അഡ്മിൻ ആയാലും യൂസർ ആയാലും നേരിട്ട് Home Page (`/`) ലേക്ക് നാവിഗേറ്റ് ചെയ്യുന്നു
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.log(error);
      
      // ❌ ലോഗിൻ ഫെയിൽ ആയാൽ കാണിക്കേണ്ട എറർ പോപ്പ്-അപ്പ്
      if (typeof Swal !== "undefined" && Swal.fire) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.response?.data?.message || "Invalid Email or Password!",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#dc2626"
        });
      } else {
        alert("Login failed: " + (error.response?.data?.message || "Invalid credentials"));
      }
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
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
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