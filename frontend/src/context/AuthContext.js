import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

/**
 * Provides authentication functionality to the application.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {ReactNode} The authenticated component tree.
 */
export function AuthProvider({ children }) {
    const existingTokens = JSON.parse(localStorage.getItem('tokens'));
    const [authTokens, setAuthTokens] = useState(existingTokens);

    /**
     * Sets the authentication tokens and stores them in the local storage.
     *
     * @param {Object} data - The authentication tokens.
     */
    const setTokens = (data) => {
        localStorage.setItem('tokens', JSON.stringify(data));
        setAuthTokens(data);
    };

    return (
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
            {children}
        </AuthContext.Provider>
    );
}
