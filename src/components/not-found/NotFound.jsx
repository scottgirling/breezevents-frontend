import { Link } from "react-router-dom";
import "./NotFound.css";

export const NotFound = () => {
    return (
        <section className="not-found">
            <h1>Not quite the ticket...</h1>
            <p>Looks like this page is missing. Double check the URL for errors. Otherwise, you can return to the Home page.</p>
            <Link to="/">
                <button>
                    Return to Home
                </button>
            </Link>
        </section>
    )
}