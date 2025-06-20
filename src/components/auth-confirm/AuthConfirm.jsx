import { Link } from "react-router-dom";
import "./AuthConfirm.css";

export const AuthConfirm = () => {
    return (
        <section className="auth-confirm">
            <h1>Email confirmed!</h1>
            <Link to="/account">
                <button className="btn btn-salmon">
                    Sign In
                </button>
            </Link>
        </section>
    )
}