import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../lib/toast";
import { BACKEND_URL } from "../lib/globals";
import { useLocation } from "react-router-dom";


const ResetPasswordVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (!password || !confirmPassword) {
        setError("Please enter and confirm your new password.");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/reset-password/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (response.status === 200) {
        return navigate("/login?emailVerified=true");
      }

      showToast(data.message);
    } catch (e) {
      console.error(e);
      setError(e.message || "There was an error. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        <form className="loginContainer">
          <h2 className="loginTitle">Set New Password</h2>
          <div className="form-group">
            <label>New Password</label>
            <span className="text-danger">*</span>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <span className="text-danger">*</span>
            <input
              className="form-control"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
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
          {error && <div className="text-danger text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordVerify;
