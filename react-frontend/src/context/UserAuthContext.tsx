import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { UserContextAttributes } from "../types/interfaces";

interface AuthContextAttributes {
    user: UserContextAttributes | null,
    setUser: (user: UserContextAttributes | null) => void,
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextAttributes>({
    user: null,
    setUser: () => { },
    isLoading: true,
});

export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<UserContextAttributes | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // on app refresh, check authentication token is valid
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/verify-token", {
                    method: "GET",
                    "credentials": "include"
                });

                console.log("verify response: ", response);
                if (response.ok) {
                    const userData = await response.json()
                    setUser(userData);
                }
                setIsLoading(false);

            } catch (error) {
                console.log("Failed to fetch user: ", error);
            };
        };

        fetchUser();
    }, [])

    // memoize the context values so it remains the same between renders
    const value = useMemo(() => (
        { user, setUser, isLoading }
    ), [user, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthUser = () => useContext(AuthContext);