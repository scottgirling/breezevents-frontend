import { Link } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import { fetchEvents, fetchTags } from '../../utils/api';

export const Home = () => {
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
        <>
            <h2 className="home-title">Discover your next <span className="italic-green">unforgettable</span> event today</h2>
            <p className="home-subheading">Join <span className="italic-green">breez<span className="bold-e">e</span>vents</span> to effortlessly find and book awesome events. Experience the joy of seamless planning.</p>
            <section className="home-buttons">
                <Link to="/account">
                    <button className="btn btn-green">
                        Sign Up
                    </button>
                </Link>
                <Link to="/events">
                    <button className="btn btn-salmon">
                        Explore
                    </button>
                </Link>
            </section>
            <section className="sub-section">
                <img src="../../../home-top.jpg"/>
                <h3>Discover Our Exciting Event Features</h3>
                <p>Experience seamless event booking with our user-friendly platform.</p>
                <img src="../../../home-features.jpg"/>
            </section>
            <section className="sub-section">
                <h3>Effortlessly Book Your Next Event Today</h3>
                <p><span className="italic-green">breez<span className="bold-e">e</span>vents</span> makes event booking a breeze. Unparalleled convenience allows you to book events with just a few clicks.</p>
                <img src="../../../home-effortlessly.jpg" />
            </section>
            <section className="sub-section">
                <h3>Explore a Variety of Events</h3>
                <p>Choose from a wide range of events tailored to your interests.</p>
                <img src="../../../home-variety.jpg" />
            </section>
            <section className="sub-section">
                <h3>Secure Payments for Peace of Mind</h3>
                <p>Enjoy safe and reliable payment options for your bookings.</p>
                <img src="../../../home-payments.jpg" />
            </section>
            <section className="home-buttons">
                <Link to="/account">
                    <button className="btn btn-green">
                        Sign Up
                    </button>
                </Link>
                <Link to="/events">
                    <button className="btn btn-salmon">
                        Explore
                    </button>
                </Link>
            </section>
            <section className="sub-section">
                <h3>Discover Events</h3>
                <p>Explore upcoming events are secure your spot today!</p>
            </section>

            <section className="discover-events">
                <ul className="tags-list">
                    <li className="tag-name">
                        <button className="btn btn-tag" onClick={() => {
                            setEventTag("");
                            setActiveEventTag("View all");
                        }}>
                            View all
                            {activeEventTag === "View all" && <p className="underline"></p>}</button>
                    </li>
                    {tags.map((tag) => {
                        return (
                            <li className="tag-name" key={tag.tag_id}>
                                <button className="btn btn-tag" value={tag.slug} onClick={(event) => {
                                    setEventTag(event.target.value);
                                    setActiveEventTag(tag.name);
                                }}>
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
                                            <button className="btn btn-white">
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
        </>
    )
}