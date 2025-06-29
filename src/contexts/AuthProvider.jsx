import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext)
};

export const signInWithEmail = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
}

export const AuthProvider = ({ children }) => {
    const [loggedInUser] = useState({});
    const [justLoggedOut, setJustLoggedOut] = useState(false);
    const [supabaseUser, setSupabaseUser] = useState(null);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
                loggedInUser.name = session.user.user_metadata.name;
                loggedInUser.id = session.user.id
                setSupabaseUser(session.user)
                setAuth(true);
            }
            if (event === "SIGNED_OUT") {
                loggedInUser.name = null;
                loggedInUser.id = null;
                setJustLoggedOut(true);
                setSupabaseUser(null);
                setAuth(false);
            }
        });
        return () => {
            data.subscription.unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ loggedInUser, justLoggedOut, supabaseUser, signInWithEmail }}>
            {children}
        </AuthContext.Provider>
    );
}