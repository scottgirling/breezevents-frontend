import { Link } from "react-router-dom";
import "./AuthConfirm.css";

export const AuthConfirm = () => {
    return (
        <section className="auth-confirm">
            <p>Email confirmed!</p>
            <Link to="/account">
                <button className="btn btn-salmon">
                    Sign In
                </button>
            </Link>
        </section>
    )
}