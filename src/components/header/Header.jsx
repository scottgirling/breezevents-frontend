import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider';
import './Header.css';

export const Header = () => {
    const { loggedInUser } = useAuth();

    return (
        <section className="header">
            <Link to="/">
                <h1 className="breezevents">breez<span className="bold-e">e</span>vents</h1>
            </Link>
            
            {loggedInUser.name ? (
                <Link 
                className="user-signin" 
                to={`breezer/${loggedInUser.id}`}
                aria-label="View your account">
                    <p className="fa-user">{loggedInUser.name[0].toUpperCase()}</p>
                </Link>
            ) : (
                loggedInUser.id ? (
                    <Link 
                    className="user-signin" 
                    to={`breezer/${loggedInUser.id}`}
                    aria-label="View your account">
                        <i className="fa-solid fa-user"></i>
                    </Link>
                ) : (
                    <Link 
                    className="user-signin" 
                    to="/account"
                    aria-label="Sign in to your account">
                        <i className="fa-solid fa-user"></i>
                    </Link>
                )
            )}
        </section>
    )
}