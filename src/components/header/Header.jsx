import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider';
import './Header.css';

export const Header = () => {
    const { loggedInUser } = useAuth();

    return (
        <section className="flex items-center justify-between 2xl:mx-20">
            <Link to="/">
                <h1 className="text-[#317575] text-3xl my-4 font-normal">breez<span className="bold-e">e</span>vents</h1>
            </Link>
            
            {loggedInUser.name ? (
                <Link 
                    className="user-signin" 
                    to={`breezer/${loggedInUser.id}`}
                    aria-label="View your account"
                >
                    <p className="fa-user text-[#317575]">{loggedInUser.name[0].toUpperCase()}</p>
                </Link>
            ) : (
                loggedInUser.id ? (
                    <Link 
                        className="user-signin" 
                        to={`breezer/${loggedInUser.id}`}
                        aria-label="View your account"
                    >
                        <i className="fa-solid fa-user text-[#317575]"></i>
                    </Link>
                ) : (
                    <Link 
                        className="user-signin" 
                        to="/account"
                        aria-label="Sign in to your account"
                    >
                        <i className="fa-solid fa-user text-[#317575]"></i>
                    </Link>
                )
            )}
        </section>
    )
}