import { AuthContext } from "../contexts/authContext";
import React, { useContext, useState } from "react";
import { login } from "../api";
import { LoginResponse } from "../types";

interface LoginCredentials {
	username: string;
	password: string;
}

const LoginPage: React.FC = () => {
	const authContext = useContext(AuthContext);

	const [credentials, setCredentials] = useState<LoginCredentials>({
		username: "",
		password: "",
	});

	const [loginError, setLoginError] = useState<string>("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setCredentials((prevCredentials) => ({
			...prevCredentials,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
	e.preventDefault();
	const accessToken = await login(credentials.username, credentials.password);
	if (accessToken.error) {
		setLoginError(accessToken.error);
	} else if(accessToken.access_token) { 
		console.log(accessToken);
		localStorage.setItem("beetman_token", accessToken.access_token);
		authContext.signIn();
		window.location.href = "/";
	} else {
		console.error("Bad state; no error or access token in login response");
	}
	};

	return (
	<div>
		<h1>Login Page</h1>
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="username">Username:</label>
				<input
				type="text"
				id="username"
				name="username"
				value={credentials.username}
				onChange={handleChange}
				required
				/>
			</div>
			<div>
				<label htmlFor="password">Password:</label>
				<input
				type="password"
				id="password"
				name="password"
				value={credentials.password}
				onChange={handleChange}
				required
				/>
			</div>
			<button type="submit">Login</button>
			{loginError ? <p>There was an error on login</p> : undefined}
		</form>
	</div>
	);
};

export default LoginPage;
