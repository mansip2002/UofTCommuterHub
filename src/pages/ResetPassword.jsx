import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../lib/toast";
import { BACKEND_URL } from "../lib/globals";

const ResetPassword = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (!email) {
        setError("Please enter your email.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Email not registered. Please check your email or Signup.");
        } else {
          throw new Error("Something went wrong. Please try again later.");
        }
      }

      showToast("Password reset instructions sent to your email.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        <form className="loginContainer">
          <h2 className="loginTitle">Reset Password</h2>
          <div className="form-group">
            <label>Email</label>
            <span className="text-danger">*</span>
            <input
              className="form-control"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
            >
              Submit
            </button>
          </div>

          <div className="d-flex justify-content-center">
            <p>
              Remember your password? <Link to="/login">Login</Link>
            </p>
          </div>

          {error && <div className="text-danger text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
