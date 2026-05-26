import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const signupUser = async (e) => {
  e.preventDefault();


  if (form.email.includes(" ")) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Email cannot contain spaces!",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#dc2626",
      });
    }

  if (
    !form.name.trim() ||
    !form.email.trim() ||
    !form.password.trim() ||
    !form.phone.trim()
  ) {
    return alert("Fields cannot be empty");
  }

  try {
    const res = await axios.post(
      "https://olx-clone-vgy9.onrender.com/api/auth/signup",
      form
    );

     console.log(res.data);

    Swal.fire({
      icon: "success",
      title: "Signup Successful",
      text: res.data.message,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#2563eb",
    });

    setTimeout(() => {
      navigate("/verify-otp", {
        state: {
          email: res.data.email,
        },
      });
    }, 1500);

  } catch (error) {
    console.log(error);

    Swal.fire({
      icon: "error",
      title: "Signup Failed",
      text: error.response?.data?.message || "Something went wrong",
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#dc2626",
    });
  }
};

  return (
    <div className="app">
      <form onSubmit={signupUser} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

            <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="Enter valid 10 digit number"
            required
            />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            minLength="6"
            required
          />

        <select name="role" onChange={handleChange}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;