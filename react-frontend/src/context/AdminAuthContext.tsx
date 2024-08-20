import React, { createContext, ReactNode, useContext, useMemo, useState } from "react"
import { AdminContextAttributes } from "../types/interfaces";

interface AdminAuthContextAttributes {
    admin: AdminContextAttributes | null,
    setAdmin: (admin: AdminContextAttributes | null) => void;
}

const AdminAuthContext = createContext<AdminAuthContextAttributes>({
    admin: null,
    setAdmin: () => { }
});

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [admin, setAdmin] = useState<AdminContextAttributes | null>(null);

    const value = useMemo(() => (
        { admin, setAdmin }
    ), [admin])

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAuthAdmin = () => useContext(AdminAuthContext);