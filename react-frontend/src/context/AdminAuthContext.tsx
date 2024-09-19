import React, { createContext, ReactNode, useContext, useMemo, useState, useEffect } from "react"
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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // on App refresh, check authentication token is valid
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/verify-token", {
                    method: "GET",
                    "credentials": "include"
                });

                if (response.ok) {
                    const adminData = await response.json();
                    setAdmin(adminData);
                };

                setIsLoading(false);

            } catch (error) {
                console.log("Failed to fetch admin authentication: ", error);
            };
        };

        fetchAdmin();
    }, []);

    const value = useMemo(() => (
        { admin, setAdmin, isLoading }
    ), [admin, isLoading])

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAuthAdmin = () => useContext(AdminAuthContext);