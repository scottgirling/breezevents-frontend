import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { supabase } from "../../supabase/client";

export const AuthRoute = () => {
    const { justLoggedOut } = useAuth();
    const { user_id } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        supabase.auth.getSession()
        .then(({ data: { session }}) => {
            if (session) {
                setUserId(session.user.id);
            }
            setLoading(false);
        })
    }, []);

    if (loading) {
        return (
            <p className="loading">Loading your profile...</p>
        );
    }

    return userId === user_id ? (
        <Outlet />
    ) : justLoggedOut ? (
        <Navigate to="/account" replace />
    ) : (
        <Navigate to="/error" replace state={{ path: location.pathname }} />
    );
}