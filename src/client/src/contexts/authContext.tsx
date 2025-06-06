import { token_check } from "../api";
import React, { useContext, useEffect, useState } from "react";

export enum AuthStatus {
	Loading,
	SignedIn,
	SignedOut,
}

export interface IAuth {
	authStatus?: AuthStatus;
	signIn?: any;
	signOut?: any;
}

const defaultState: IAuth = {
	authStatus: AuthStatus.Loading,
};

type Props = {
	children?: React.ReactNode;
};

export const AuthContext = React.createContext(defaultState);

export const AuthIsSignedIn = ({ children }: Props) => {
	const { authStatus }: IAuth = useContext(AuthContext);

	return <>{authStatus === AuthStatus.SignedIn ? children : null}</>;
};

export const AuthIsNotSignedIn = ({ children }: Props) => {
	const { authStatus }: IAuth = useContext(AuthContext);

	return <>{authStatus === AuthStatus.SignedOut ? children : null}</>;
};

const AuthProvider = ({ children }: Props) => {
	const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);

	useEffect(() => {
		async function getIsLoggedIn() {
			const res = await token_check();
			if (res && res === "success") {
                setAuthStatus(AuthStatus.SignedIn);
			} else {
				setAuthStatus(AuthStatus.SignedOut);
			}
		}
		getIsLoggedIn().then();
	}, [setAuthStatus, authStatus]);

	function signIn() {
		setAuthStatus(AuthStatus.SignedIn);
	}

	function signOut() {
		setAuthStatus(AuthStatus.SignedOut);
	}

	const state: IAuth = {
		authStatus,
		signIn,
		signOut,
	};

	if (authStatus === AuthStatus.Loading) {
		return null;
	}

	return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
