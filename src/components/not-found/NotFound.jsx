import { Link } from "react-router-dom";
import "./NotFound.css";

export const NotFound = () => {
    return (
        <section className="min-h-[50vh] my-20 text-left lg:my-40 2xl:mx-20">
            <h1 className="text-2xl font-medium">Not quite the ticket...</h1>
            <p className="my-2">Looks like this page is missing. Double check the URL for errors. Otherwise, you can return to the Home page.</p>
            <Link to="/"
                onClick={() => window.scroll(0,0)}
            >
                <button className="rtn-home-btn">
                    <i className="fa-solid fa-arrow-left mr-1"></i>Back to Home
                </button>
            </Link>
        </section>
    )
}