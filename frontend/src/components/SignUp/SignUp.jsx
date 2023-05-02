import React, { useState } from "react";
// import axios from "axios";
import "../../scss/App.scss";
import "./SignUp.scss";
import { IoLockClosedOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import 'bootstrap/dist/css/bootstrap.css';

// import { useNavigate } from "react-router-dom";

function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	// const navigate = useNavigate();

	const clearEmailError = () => {
		setEmailError("");
	};
	const clearPasswordError = () => {
		setPasswordError("");
	};

	const handleSubmit = async (e) => {

	};

	return (
		<div className="col-5 rightSide">
			<h3>Bonjour</h3>
			<form onSubmit={handleSubmit}>
				<div className="my-form">
					<div className="input-icon-container">
						<input
							className={`input-without-icon`}
							placeholder="Name"
							required
						/>
					</div>
				</div>
				<div className="my-form">
					<div className="input-icon-container">
						<input
							className={`input-without-icon`}
							placeholder="Surname"
							required
						/>
					</div>
				</div>
				<div className="my-form">
					<div className="input-icon-container">
						<input
							className={`input-without-icon`}
							placeholder="Pseudo"
							required
						/>
					</div>
				</div>
				<div className="my-form">
					<div className="input-icon-container">
						<HiOutlineMail className="input-icon" />
						<input
							type="email"
							className={`input-with-icon ${
								emailError ? "error" : "Email Incorrect"
							}`}
							placeholder={emailError || "Email"}
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								clearEmailError();
							}}
							required
						/>
						{emailError && (
							<div className="error-message">{emailError}</div>
						)}
					</div>
				</div>
				<div className="my-form">
					<div className="input-icon-container">
						<IoLockClosedOutline className="input-icon" />
						<input
							type="password"
							className={`input-with-icon ${passwordError ? "error" : ""}`}
							placeholder={passwordError || "Password"}
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								clearPasswordError();
							}}
							required
						/>
						{passwordError && (
							<div className="error-message">{passwordError}</div>
						)}
					</div>
				</div>
				<div className="submit-button">
					<button type="submit">Sign Up</button>
				</div>
			</form>
		</div>
	);
}
export default SignUp;