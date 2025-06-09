import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { fetchUserById } from "../../utils/api";
import { supabase } from "../../supabase/client";
import { AttendeeEvents } from "./attendee-profile/AttendeeEvents";
import { HostEvents } from "./host-profile/HostEvents";
import "./UserProfile.css";

export const UserProfile = () => {
    const navigate = useNavigate();
    const { user_id } = useParams();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    useState(() => {
        setLoading(true);
        fetchUserById(user_id)
        .then((returnedUser) => {
            setUser(returnedUser);
            setLoading(false);
        })
    }, []);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        navigate("/account")
    }

    if (loading) {
        return (
            <p className="loading">Loading your profile...</p>
        )
    }

    return (
        <section className="user-profile">
            <section className="welcome-back">
                {user.name && (
                    <h1>Welcome back, <span className="users-name">{user.name.split(" ")[0]}!</span></h1>
                )}
            </section>

            {user.role === "attendee" && (
                <AttendeeEvents />
            )}
            
            {user.role === "host" && (
                <HostEvents />

            )}

            <section className="profile-section">
                <section className="profile-header">
                    <h3>Your Profile</h3>
                    <section className="your-profile-button">
                        <button 
                            className="your-profile-button"
                        >
                            <i className="fa-solid fa-user-pen"></i>
                            <p>Edit Profile</p>
                        </button>
                    </section>
                </section>
                <section>
                    <form className="user-profile-form">
                        <section>
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" placeholder={user.name}></input>
                        </section>
                        <section>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" placeholder={user.username}></input>
                        </section>
                        <section>
                            <label htmlFor="email">Email:</label>
                            <textarea type="text" id="email" name="email" placeholder={user.email}></textarea>
                        </section>
                        <section>
                            <label htmlFor="bio">Bio:</label>
                            <textarea type="text" id="bio" name="bio" placeholder={user.bio}></textarea>
                        </section>
                    </form>
                </section>

                <section>
                    <button className="signout" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </section>

            </section>
        </section>
    )
}