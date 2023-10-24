import React from "react";
import { useState } from "react";

const Login = () => {
	let [loginSignup, setLoginSignup] = useState("login")

	const changePage = () => {
		setLoginSignup(
			loginSignup === "login" ? "signup" : "login"
		)
	}

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
	} else {
		return (
			<div className="loginPage">
				<div className="loginForm">
					<form className="loginContainer">
						<h2 className="loginTitle">Signup</h2>
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
							<p>Already have an account? {" "} 
								<span className="signupRedirect" onClick={changePage}>Sign In</span>
							</p>
						</div>
					</form>
				</div>
			</div>
		);
	}
};

export default Login;
