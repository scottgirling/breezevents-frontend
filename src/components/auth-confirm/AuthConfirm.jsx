import { Link } from "react-router-dom";

export const AuthConfirm = () => {
    return (
        <section className="mt-8 min-h-[60vh] sm:min-h-[70vh]">
            <h1>Email confirmed!</h1>
            <Link to="/account">
                <button className="btn btn-salmon m-4">
                    Sign In
                </button>
            </Link>
        </section>
    )
}