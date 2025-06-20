import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import "./Error.css";

export const Error = () => {
    const { loggedInUser } = useAuth();
    const navigate = useNavigate();

    return (
        <section className="error">
            <i className="fa-solid fa-circle-exclamation"></i>
            <h1>Oops... it looks like you're trying to visit a page you are not authorised to access.</h1>
            <section className="error-redirect-buttons">
                <button 
                    id="error-button-home"
                    onClick={() => navigate("/")}
                >
                    Home
                </button>
                {loggedInUser.id ? (
                    <button 
                        id="error-button-account"
                        onClick={() => navigate(`/breezer/${loggedInUser.id}`)}
                    >
                        Your Account
                    </button>
                ) : (
                    <button 
                        id="error-button-account"
                        onClick={() => navigate("/account")}
                    >
                        Sign In
                    </button>
                )}
            </section>
        </section>
    )
}