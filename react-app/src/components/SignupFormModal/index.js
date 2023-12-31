import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(signUp(username, email, password));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	return (
		<div className="modal-wrapper">
			<h1 className="form-title">Sign Up</h1>
			<form className="form-box" onSubmit={handleSubmit}>
				<ul className="errors-list">
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label className="form-label">
					Email:
					<input
						type="text"
						value={email}
						minLength='5'
						maxLength='50'
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label className="form-label">
					Username:
					<input
						type="text"
						value={username}
						minLength='5'
						maxLength='50'
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label className="form-label">
					Password:
					<input
						type="password"
						value={password}
						minLength='5'
						maxLength='50'
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<label className="form-label">
					Confirm Password:
					<input
						type="password"
						value={confirmPassword}
						minLength='5'
						maxLength='50'
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
}

export default SignupFormModal;