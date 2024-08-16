import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { UserContextAttributes } from "../types/interfaces";

interface AuthContextAttributes {
    user: UserContextAttributes | null,
    setUser: (user: UserContextAttributes | null) => void,
};

const AuthContext = createContext<AuthContextAttributes>({
    user: null,
    setUser: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<UserContextAttributes | null>(null);

    // memoize the context values so it remains the same between renders
    const value = useMemo(() => (
        { user, setUser }
    ), [user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);