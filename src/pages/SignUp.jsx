import { useState } from "react";
import { Link } from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [verifyEmailSent, setVerifyEmailSent] = useState(false);

  const onSubmit = async () => {
    const response = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.status === 200) {
      console.log("Success.");
      setVerifyEmailSent(true);
    }
  };

  if (verifyEmailSent) {
    return (
      <div className="loginPage">
        <div className="loginForm">
          <form className="loginContainer">
            <h2 className="loginTitle">Account created</h2>
            <div className="verifyContainer">
              <CiCircleCheck fontSize={80} color="#4BB543" />
              Please check your email for a verification link.
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="loginPage">
      <div className="loginForm">
        <form className="loginContainer">
          <h2 className="loginTitle">Signup</h2>
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
              Sign Up
            </button>
          </div>
          {message && <div className="message">{message}</div>}
          <div className="d-flex justify-content-center">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
