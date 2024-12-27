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
	    const loginAttempt = await login(credentials.username, credentials.password);
	    if (loginAttempt.error) {
	    	setLoginError(loginAttempt.error);
	    } else {
            authContext.signIn();
            window.location.href = '/';
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
			{loginError ? <p>{loginError}</p> : undefined}
		</form>
	</div>
	);
};

export default LoginPage;
