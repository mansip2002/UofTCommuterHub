import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { setStorage } from "../lib/storage";
import { useToast } from "../lib/toast";
import { BACKEND_URL } from "../lib/globals";

const Login = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.get("emailVerified") === "true") {
      showToast("Email verified!");
      setParams({});
    }
  }, [params]);

  const onSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill out all required fields.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw Error(`Fetch failed with status ${response.status}`);
      }

      const data = await response.json();

      setStorage("capstone-token", data.token);

      navigate(`/manage-commutes`);
    } catch (e) {
      console.error(e);
      setError("There was an error signing you up. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        <form className="loginContainer">
          <h2 className="loginTitle">Login</h2>
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

          <div className="form-group">
            <label>Password</label>
            <span className="text-danger">*</span>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>

          {error && <div className="text-danger text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
