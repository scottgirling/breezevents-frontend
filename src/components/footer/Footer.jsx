import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import "./Footer.css";

export const Footer = () => {
    const { loggedInUser } = useAuth();

    const route = loggedInUser.name ? `/breezer/${loggedInUser.id}` : "/account";

    return (
        <section className="footer">
            <section>
                <Link to="/">
                    <p>Home</p>
                </Link>
                <Link to="/events">
                    <p>Events</p>
                </Link>
                <Link to={route}>
                    <p>Profile</p>
                </Link>
            </section>
            <section>
                <p>Privacy</p>
                <p>Terms</p>
                <p><i className="fa-solid fa-copyright"></i> breezevents</p>
            </section>
            <section className="contact">
                <p>Contact</p>
                <p><i className="fa-brands fa-facebook"></i></p>
                <p><i className="fa-brands fa-x-twitter"></i></p>
                <p><i className="fa-brands fa-instagram"></i></p>
            </section>
        </section>
    );
}