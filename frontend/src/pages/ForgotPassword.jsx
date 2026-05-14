import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setResetLink(res.data.resetLink);
      alert("Reset link generated");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="app">
      <form className="product-form" onSubmit={handleForgotPassword}>
        <h1>Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Get Reset Link</button>

        {resetLink && (
          <div className="reset-link-box">
            <p>Reset link generated:</p>

            <a href={resetLink}>{resetLink}</a>
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;