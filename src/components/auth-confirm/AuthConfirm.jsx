import { Link } from "react-router-dom"

export const AuthConfirm = () => {
    return (
        <>
            <p>Email confirmed!</p>
            <Link to="/account">
                <button>
                    Sign In
                </button>
            </Link>
        </>
    )
}