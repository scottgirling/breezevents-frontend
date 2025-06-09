import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider';
import './Header.css';

export const Header = () => {
    const { loggedInUser } = useAuth();
    console.log(loggedInUser, "<<<<")

    return (
        <section className="header">
            <Link to="/">
                <h1 className="breezevents">breez<span className="bold-e">e</span>vents</h1>
            </Link>
            {loggedInUser.name ? (
                <Link className="user-signin" to={`breezer/${loggedInUser.id}`}>
                    <p className="fa-user">{loggedInUser.name[0]}</p>
                </Link>
            ) : (
                loggedInUser.id ? (
                    <Link className="user-signin" to={`breezer/${loggedInUser.id}`}>
                        <i className="fa-solid fa-user"></i>
                    </Link>
                ) : (
                    <Link className="user-signin" to="/account">
                        <i className="fa-solid fa-user"></i>
                    </Link>
                )
            )}
        </section>
    )
}