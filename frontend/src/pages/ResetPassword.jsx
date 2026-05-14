import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");

  const { token } = useParams();

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password,
        }
      );

      alert(res.data.message);

      navigate("/login");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Password reset failed"
      );
    }
  };

  return (
    <div className="app">
      <form className="product-form" onSubmit={handleResetPassword}>
        <h1>Reset Password</h1>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;