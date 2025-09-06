import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const API_URL = process.env.REACT_APP_QUERY_SVC_URL;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    API_URL + "/get_me", 
                    { 
                        method: "GET",
                        credentials: "include" 
                    });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}