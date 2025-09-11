import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const API_URL = process.env.REACT_APP_QUERY_SVC_URL;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
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
    
    useEffect (() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
