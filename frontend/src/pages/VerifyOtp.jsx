import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

const [email, setEmail] = useState(location.state?.email || "");
const [otp, setOtp] = useState("");
const [loading, setLoading] = useState(false); 
const [timer, setTimer] = useState(0);

  const verifyOtp = async (e) => {
    e.preventDefault();
    

    try {
      const res = await axios.post("https://olx-clone-vgy9.onrender.com/api/auth/verify-otp", {
        email,
        otp,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

const resendOtp = async () => {
  if (loading || timer > 0) return;

  setLoading(true);

  try {
    const res = await axios.post(
      "https://olx-clone-vgy9.onrender.com/api/auth/resend-otp",
      { email }
    );

    alert(res.data.message);

    setTimer(30); // 👈 start timer

  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "Failed to resend OTP");
  }

  setLoading(false);
};

useEffect(() => {
  let interval;

  if (timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [timer]);

  return (
    <div className="app">
      <form className="product-form" onSubmit={verifyOtp}>
        <h1>Verify OTP</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit">Verify OTP</button>
            <p
            style={{
                marginTop: "10px",
                cursor: "pointer",
                color: "blue",
                textAlign: "center",
            }}
            onClick={resendOtp}
            >
            {loading
            ? "Sending..."
            : timer > 0
            ? `Resend in ${timer}s`
            : "Resend OTP"}
            </p>
      </form>
    </div>
  );
}

export default VerifyOtp;