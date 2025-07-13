import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import "./Error.css";

export const Error = () => {
    const { loggedInUser } = useAuth();
    const navigate = useNavigate();

    return (
        <section className="my-8 mx-auto min-h-[60vh]">
            <i className="fa-solid fa-circle-exclamation text-[#317575] text-2xl mb-4"></i>
            <h1>Oops... it looks like you're trying to visit a page you are not authorised to access.</h1>
            <section className="flex items-center justify-center text-xs my-6">
                <button 
                    className="home-btn"
                    onClick={() => navigate("/")}
                >
                    Home
                </button>
                {loggedInUser.id ? (
                    <button 
                        onClick={() => navigate(`/breezer/${loggedInUser.id}`)}
                    >
                        Your Account
                    </button>
                ) : (
                    <button 
                        className="account-btn"
                        onClick={() => navigate("/account")}
                    >
                        Sign In
                    </button>
                )}
            </section>
        </section>
    )
}