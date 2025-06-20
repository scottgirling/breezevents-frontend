import { Link } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import { fetchEvents, fetchTags } from '../../utils/api';
import { useAuth } from '../../contexts/AuthProvider';

export const Home = () => {
    const { loggedInUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [eventTag, setEventTag] = useState("");
    const [activeEventTag, setActiveEventTag] = useState("View all");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetchTags()
        .then((returnedTags) => {
            setTags(returnedTags);
        })
        fetchEvents(eventTag, null, null, null, null, 3)
        .then((returnedEvents) => {
            setEvents(returnedEvents)
            setLoading(false);
        })
    }, [eventTag]);

    return (
        <main>
            <section className="home-top">
                <section>
                    <h1 className="home-title">Discover your next <span className="italic-green">unforgettable</span> event today</h1>
                    <p className="home-subheading">Join <span className="italic-green">breez<span className="bold-e">e</span>vents</span> to effortlessly find and book awesome events. Experience the joy of seamless planning.</p>
                    <section className="home-buttons">
                        {loggedInUser.id ? (
                            <Link to={`/breezer/${loggedInUser.id}`}>
                                <button className="btn btn-green">
                                    Sign In
                                </button>
                            </Link>
                        ) : (
                            <Link to="/account">
                                <button className="btn btn-green">
                                    Sign In
                                </button>
                            </Link>
                        )}
                        <Link to="/events">
                            <button className="btn btn-salmon">
                                Find Events
                            </button>
                        </Link>
                    </section>
                </section>
                <img src="../../../home-top.jpg" alt=""/>
            </section>
            <section className="sub-section" id="platform-features">
                <section>
                    <h2 className="platform-features-heading">Discover Our Platform Features</h2>
                    <p className="discover-sub-title">Experience seamless event booking with our user-friendly platform.</p>
                </section>
                <img src="../../../home-features.jpg" alt=""/>
            </section>
            <section className="wide-screen">
                <section className="sub-section">
                    <h3>Effortless</h3>
                    <p>Unparalleled convenience allows you to book with just a few clicks.</p>
                    <img src="../../../home-effortlessly.jpg" alt=""/>
                </section>
                <section className="sub-section">
                    <h3>Variety</h3>
                    <p>Choose from a wide range of events tailored to your interests.</p>
                    <img src="../../../home-variety.jpg" alt=""/>
                </section>
                <section className="sub-section">
                    <h3>Secure</h3>
                    <p>Enjoy safe and reliable payment options for your bookings.</p>
                    <img src="../../../home-payments.jpg" alt=""/>
                </section>
            </section>
            <section className="home-buttons">
                {loggedInUser.id ? (
                    <Link to={`/breezer/${loggedInUser.id}`}>
                        <button className="btn btn-green">
                            Sign In
                        </button>
                    </Link>
                ) : (
                    <Link to="/account">
                        <button className="btn btn-green">
                            Sign In
                        </button>
                    </Link>
                )}
                <Link to="/events">
                    <button className="btn btn-salmon">
                        Find Events
                    </button>
                </Link>
            </section>
            
            <section className="sub-section">
                <h4>Discover Events</h4>
                <p className="discover-sub-title">Explore upcoming events are secure your spot today!</p>
            </section>

            <section className="discover-events">
                <ul className="tags-list">
                    <li className="tag-name">
                        <button 
                        className="btn btn-tag" 
                        onClick={() => {
                            setEventTag("");
                            setActiveEventTag("View all");
                        }}
                        aria-label="View all events">
                            View all
                            {activeEventTag === "View all" && <p className="underline"></p>}</button>
                    </li>
                    {tags.map((tag) => {
                        return (
                            <li className="tag-name" key={tag.tag_id}>
                                <button 
                                className="btn btn-tag" 
                                value={tag.slug} 
                                onClick={(event) => {
                                    setEventTag(event.target.value);
                                    setActiveEventTag(tag.name);
                                }}
                                aria-label={`View ${tag.name} events`}>
                                    {tag.name}
                                    {tag.name === activeEventTag && <p className="underline"></p>}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <section>
                {loading ? (
                    <p className="events-loading">Loading events...</p>
                ) : (
                    events.length ? (
                        <ul>
                        {events.map((event) => {
                            return (
                                <li className="event-card" key={event.event_id}>
                                    <h4 className="event-title">{event.title}</h4>
                                    <p className="event-overview">{event.event_overview}</p>
                                    <section className="event-price-date">
                                        {event.price !== 0 ? (
                                            <p className="ticket-price">£{event.price}</p>
                                        ) : (
                                            <p className="free-ticket">FREE</p>
                                        )}
                                        <p className="event-date">{new Date(event.start_time).toDateString()}</p>
                                        <Link to={`/events/${event.event_id}`}>
                                            <button 
                                            className="btn btn-white"
                                            aria-label={`Find tickets for ${event.title}`}>
                                                Find Tickets
                                            </button>
                                        </Link>
                                    </section>
                                </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p className="no-events-found">No events found. Please select another category.</p>
                    )
                )}
            </section>

            <section className="find-more-events">
                <Link to="/events">
                    <button className="btn btn-salmon">
                        View More Events
                    </button>
                </Link>
            </section>
        </main>
    )
}