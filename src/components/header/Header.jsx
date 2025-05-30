import { Link } from 'react-router-dom'
import './Header.css'

export const Header = () => {
    return (
        <section className="header">
            <Link to="/">
                <h1 className="breezevents">breez<span className="bold-e">e</span>vents</h1>
            </Link>
            <Link className="user-signin" to="/account">
                <i className="fa-solid fa-user"></i>
            </Link>
        </section>
    )
}