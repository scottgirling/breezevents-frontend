import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { supabase } from "../../supabase/client";
import { useEffect, useState } from "react";

export const AuthRoute = () => {
    const { loggedInUser, justLoggedOut } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession()
        .then(({ data: { session }}) => {
            setSession(session);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <p className="loading">Loading your profile...</p>
        );
    }

    return loggedInUser.id ? (
        <Outlet />
    ) : justLoggedOut ? (
        <Navigate to="/account" replace />
    ) : (
        <Navigate to="/error" replace state={{ path: location.pathname }} />
    );
}