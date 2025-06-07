import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import "./UserProfile.css";
import { fetchEventsByUserId, fetchUserById } from "../../utils/api";
import { supabase } from "../../supabase/client";
import { AttendeeEvents } from "./attendee-profile/AttendeeEvents";
import { HostEvents } from "./host-profile/HostEvents";

export const UserProfile = () => {
    const navigate = useNavigate();
    const { user_id } = useParams();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [role, setRole] = useState(null);

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [formDisabled, setFormDisabled] = useState(true);

    useState(() => {
        setLoading(true);
        fetchUserById(user_id)
        .then((returnedUser) => {
            setUser(returnedUser);
            setRole(returnedUser.role)
        })
        fetchEventsByUserId(user_id)
        .then((returnedEvents) => {
            const updatedEvents = returnedEvents.map((event) => {
                const today = new Date();
                const eventDate = new Date(event.end_time)
                const isUpcoming = today < eventDate;
                return { ...event, isUpcoming}
            })
            return updatedEvents;
        })
        .then((updatedEvents) => {
            const eventsInTheFuture = [];
            const eventsInThePast = [];
            updatedEvents.filter((event) => {
                if (event.isUpcoming === true) {
                    eventsInTheFuture.push(event);
                } else {
                    eventsInThePast.push(event);
                }
            })
            setUpcomingEvents(eventsInTheFuture);
            setPastEvents(eventsInThePast);
            setLoading(false);
        })
    }, []);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        navigate("/account")
    }

    const border = () => {
        if (formDisabled === false) {
            return "border";
        }
    }

    if (loading) {
        return (
            <p>Loading your profile...</p>
        )
    }

    return (
        <section>
            <section className="welcome-back">
                {user.name && (
                    <h1>Welcome back, <span className="users-name">{user.name.split(" ")[0]}!</span></h1>
                )}
            </section>

            {user.role === "attendee" ? (
                <AttendeeEvents upcomingEvents={ upcomingEvents } pastEvents={ pastEvents }/>
            ) : (
                <HostEvents />
            )}

            <section className="profile-section">
                <section className="your-profile-header">
                    <h3>Your Profile</h3>
                    <section className="edit-profile">
                        <button 
                            className="edit-profile"
                            onClick={() => {
                                setFormDisabled(false)
                                border();
                            }}
                        >
                            <i className="fa-solid fa-user-pen"></i>
                            <p>Edit Profile</p>
                        </button>
                    </section>
                </section>
                <section>
                    <form>
                        <section>
                            <label htmlFor="name">Name:</label>
                            <input className={border()} disabled={formDisabled} type="text" id="name" name="name" placeholder={user.name}></input>
                        </section>
                        <section>
                            <label htmlFor="username">Username:</label>
                            <input className={border()} disabled={formDisabled} type="text" id="username" name="username" placeholder={user.username}></input>
                        </section>
                        <section>
                            <label htmlFor="email">Email:</label>
                            <input className={border()} disabled={formDisabled} type="text" id="email" name="email" placeholder={user.email}></input>
                        </section>
                        <section>
                            <label htmlFor="bio">Bio:</label>
                            <input className={border()} disabled={formDisabled} type="text" id="bio" name="bio" placeholder={user.bio}></input>
                        </section>
                        <button 
                            className="discard-changes"
                            onClick={(event) => {
                                event.preventDefault();
                                setFormDisabled(true);
                            }}
                        >
                            Discard Changes
                        </button>
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