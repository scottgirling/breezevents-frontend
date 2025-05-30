import { Link } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import { fetchEvents, fetchTags } from '../../utils/api';

export const Home = () => {
    const [tags, setTags] = useState([]);
    const [eventTag, setEventTag] = useState("");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchTags()
        .then((returnedTags) => {
            setTags(returnedTags);
        })
        fetchEvents(eventTag)
        .then((returnedEvents) => {
            setEvents(returnedEvents)
        })
    }, [eventTag]);


    return (
        <>
            <h2 className="home-title">Discover your next <span className="italic-green">unforgettable</span> event today</h2>
            <p className="join">Join <span className="italic-green">breez<span className="bold-e">e</span>vents</span> to effortlessly find and book awesome events. Experience the joy of seamless planning.</p>
            <section className="home-buttons">
                <Link to="/account">
                    <button className="btn btn-green">
                        Sign Up
                    </button>
                </Link>
                <button className="btn btn-salmon">
                    Explore
                </button>
            </section>
            <section>
                <img src="../../../home-top.jpg"/>
            </section>
            <section className="features">
                <h3>Discover Our Exciting Event Features</h3>
                <p>Experience seamless event booking with our user-friendly platform.</p>
                <img src="../../../home-features.jpg"/>
            </section>
            <section className="effortlessly">
                <h3>Effortlessly Book Your Next Event Today</h3>
                <p><span className="italic-green">breez<span className="bold-e">e</span>vents</span> makes event booking a breeze. Unparalleled convenience allows you to book events with just a few clicks.</p>
                <img src="../../../home-effortlessly.jpg" />
            </section>
            <section className="variety">
                <h3>Explore a Variety of Events</h3>
                <p>Choose from a wide range of events tailored to your interests.</p>
                <img src="../../../home-variety.jpg" />
            </section>
            <section className="payments">
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
                <button className="btn btn-salmon">
                    Explore
                </button>
            </section>
            <section className="discover">
                <h3>Discover Events</h3>
                <p>Explore upcoming events are secure your spot today!</p>
            </section>

            <section className="discover-events">
                <ul className="tags-list">
                    <li className="tag-name">View all</li>
                    {tags.map((tag) => {
                        return (
                            <>
                                <li className="tag-name" key={tag.tag_id}>{tag.name}</li>
                            </>
                        )
                    })}
                </ul>
            </section>

            <section>
                <ul>
                    {events.map((event) => {
                        return (
                            <>
                                <li className="event-card" key={event.event_id}>
                                    <h4 className="event-title">{event.title}</h4>
                                    <p className="event-overview">{event.event_overview}</p>
                                    <section className="event-price-date">
                                        {event.price !== 0 ? (
                                            <p>£{event.price}</p>
                                        ) : (
                                            <p className="free-ticket">FREE</p>
                                        )}
                                        <p>{new Date(event.start_time).toDateString()}</p>
                                        <button className="btn btn-white">
                                            Find Tickets
                                        </button>
                                    </section>
                                </li>
                            </>
                        )
                    })}
                </ul>
            </section>
        </>
    )
}