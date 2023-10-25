import React from "react";
import { useState } from "react";

const Login = () => {
	let [loginSignup, setLoginSignup] = useState("login")
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [verificationCode, setVerificationCode] = useState("");

	const changePage = () => {
		setLoginSignup(
			loginSignup === "login" ? "signup" : "login"
		)
	}

	const handleSubmit = async () => {
		if (loginSignup === "signup") {
		  const response = await fetch("http://127.0.0.1:5000/register", {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		  });
	
		  const data = await response.json();
		  setMessage(data.message);
		  if (data.message === "Registration successful! Check your email for a verification code.") {
			// Email registration was successful, mark email as verified
			setLoginSignup("verify");
		  }
		} else if (loginSignup === "verify") {
			// Handle verification
			const response = await fetch("http://127.0.0.1:5000/verify", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({ email, code: verificationCode }),
			});
	  
			const data = await response.json();
			setMessage(data.message);
		} else {
		  // tba login functionality 
		}
	};
	

	if (loginSignup == "login") {
		return (
			<div className="loginPage">
				<div className="loginForm">
					<form className="loginContainer">
						<h2 className="loginTitle">Login</h2>
						<div className="form-group">
							<label>Email</label>
							<input class="form-control" type="email" placeholder="Enter your email"></input>
						</div>
						<br></br>
						<div className="form-group">
							<label>Password</label>
							<input class="form-control" type="text" placeholder="Enter your password"></input>
						</div>
						<br></br>
						<div class="d-grid gap-2">
							<button class="btn btn-primary" type="button">Submit</button>
						</div>
						<br></br>
						<div className="d-flex justify-content-center">
							<p>Don't have an account? {" "} 
								<span className="signupRedirect" onClick={changePage}>Sign Up</span>
							</p>
						</div>
					</form>
				</div>
			</div>
		);
	} else if (loginSignup == "signup") {
		return (
			<div className="loginPage">
				<div className="loginForm">
					<form className="loginContainer">
						<h2 className="loginTitle">Signup</h2>
						<div className="form-group">
							<label>Email</label>
							<input class="form-control" type="email" placeholder="Enter your email"
							value={email} onChange={(e) => setEmail(e.target.value)}></input>
						</div>
						<div class="d-grid gap-2">
							<button class="btn btn-primary" type="button" onClick={handleSubmit}>Sign Up</button>
						</div>
						{message && ( // display the message if it exists
						<div className="message">
							{message}
						</div>
						)}
						<br></br>
						<div className="d-flex justify-content-center">
							<p>Already have an account? {" "} 
								<span className="signupRedirect" onClick={changePage}>Sign In</span>
							</p>
						</div>
					</form>
				</div>
			</div>
		);
	}
	else if (loginSignup === "verify") {
		// Render the email verification form
		return (
		  <div className="loginPage">
			<div className="loginForm">
			  <form className="loginContainer">
				<h2 className="loginTitle">Verify Email</h2>
				<div className="form-group">
				  <label>Verification Code</label>
				  <input
					className="form-control"
					type="text"
					placeholder="Enter verification code"
					value={verificationCode}
					onChange={(e) => setVerificationCode(e.target.value)}
				  ></input>
				</div>
				<div className="d-grid gap-2">
				  <button
					className="btn btn-primary"
					type="button"
					onClick={handleSubmit}
				  >
					Verify
				  </button>
				</div>
				{message && (
				  <div className="message">
					{message}
				  </div>
				)}
			  </form>
			</div>
		  </div>
		);
	  }
};

export default Login;
