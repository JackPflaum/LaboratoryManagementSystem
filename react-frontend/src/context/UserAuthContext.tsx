import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { messageAttributes, UserContextAttributes } from "../types/interfaces";
import { updateCache } from "./update-cache";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client"

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
    const queryClient = useQueryClient();

    // on app refresh, check authentication token is valid
    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem("user");
            console.log("STORED USER:", storedUser);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setIsLoading(false);
                return
            };

            try {
                const response = await fetch("http://localhost:8000/api/verify-token", {
                    method: "GET",
                    "credentials": "include"
                });

                if (response.ok) {
                    const userData = await response.json();
                    localStorage.setItem("user", userData);
                    setUser(userData);
                }
                setIsLoading(false);

            } catch (error) {
                console.log("Failed to fetch user: ", error);
            };
        };

        fetchUser();
    }, [])

    useEffect(() => {
        // open a websocket connection if user is authenticated
        if (user !== null) {
            const websocket = io("http://localhost:8000", {
                // withCredentials: true,
            });

            websocket.on("connect", () => {
                console.log("Websocket connected");
            });

            // handle updating the relevant query cache based on incoming messages
            websocket.on("message", (message: messageAttributes) => {
                console.log(`Websocket message: ${message.type} has been ${message.action} at ${message.timestamp}`);
                updateCache({ message, queryClient });
            });

            // close the websocket connection when component unmounts or user changes
            return () => {
                if (websocket) {
                    websocket.close();
                    console.log("Websocket disconnected");
                };
            };
        }
    }, [user, queryClient])

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