import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { setStorage } from "../lib/storage";
import { useToast } from "../lib/toast";

const Login = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (params.get("emailVerified") === "true") {
      showToast("Email verified!");
      setParams({});
    }
  }, [params]);

  const onSubmit = async () => {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    setStorage("capstone-token", data.token);

    if (response.status === 200) {
      console.log("success");
      navigate(`/user-profile?email=${encodeURIComponent(email)}`);
    } else {
      console.error(data.message);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        <form className="loginContainer">
          <h2 className="loginTitle">Login</h2>
          <div className="form-group">
            <label>Email</label>
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
            >
              Submit
            </button>
          </div>

          <div className="d-flex justify-content-center">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
