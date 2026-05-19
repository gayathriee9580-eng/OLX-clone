import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    try {
      const res = await axios.post(
        "https://olx-clone-vgy9.onrender.com/api/auth/signup",
        form
      );

        alert(res.data.message);

        navigate("/verify-otp", {
        state: {
            email: res.data.email,
        },
        });

    } catch (error) {
      console.log(error);
      alert("Signup failed");
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