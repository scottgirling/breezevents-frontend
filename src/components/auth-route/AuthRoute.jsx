import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider"

export const AuthRoute = () => {
    const { loggedInUser, justLoggedOut } = useAuth();
    const location = useLocation();

    return loggedInUser.id ? (
        <Outlet />
    ) : justLoggedOut ? (
        <Navigate to="/account" replace />
    ) : (
        <Navigate to="/error" replace state={{ path: location.pathname }} />
    );
}