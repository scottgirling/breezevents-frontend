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
            <section>
                <h1 className="text-left text-3xl/10 font-semibold my-4 sm:text-6xl/18 sm:text-center">Discover your next <span className="text-[#317575] italic">unforgettable</span> event today</h1>
                <p className="text-xs sm:text-3xl/10">Join <span className="text-[#317575] italic"
                >breez<span className="bold-e">e</span>vents</span> to effortlessly find and book awesome events. Experience the joy of seamless planning.</p>
                <section className="my-3 mx-16 flex justify-around sm:justify-center sm:m-6">
                    {loggedInUser.id ? (
                        <Link to={`/breezer/${loggedInUser.id}`}>
                            <button 
                            className="btn btn-green sm:mx-4" 
                            id="text-base"
                            >
                                Sign In
                            </button>
                        </Link>
                    ) : (
                        <Link to="/account">
                            <button 
                            className="btn btn-green sm:mx-4"
                            id="text-base"
                            >
                                Sign In
                            </button>
                        </Link>
                    )}
                    <Link to="/events">
                        <button 
                        className="btn btn-salmon sm:mx-4"
                        id="text-base"
                        >
                            Find Events
                        </button>
                    </Link>
                </section>
            </section>
            <img className="w-[85%] sm:w-[75%] m-auto rounded-md xl:w-[50%]" src="../../../home-top.avif" fetchPriority="high" alt=""/>
            <section className="text-left" id="platform-features">
                <section>
                    <h2 className="feature-sub-heading">Discover Our Platform Features</h2>
                    <p className="lg:text-2xl">Experience seamless event booking with our user-friendly platform.</p>
                </section>
                <section className="sub-section">
                    <img src="../../../home-features.avif" alt=""/>
                </section>
            </section>
            <section 
            id="wide-screen"
            className="lg:flex flex-wrap items-center justify-center"
            >
                <section className="sub-section">
                    <h3 className="feature-sub-heading">Effortless</h3>
                    <p>Unparalleled convenience allows you to book with just a few clicks.</p>
                    <img src="../../../home-effortlessly.avif" loading="lazy" alt=""/>
                </section>
                <section className="sub-section">
                    <h3 className="feature-sub-heading">Variety</h3>
                    <p>Choose from a wide range of events tailored to your interests.</p>
                    <img src="../../../home-variety.avif" loading="lazy" alt=""/>
                </section>
                <section className="sub-section">
                    <h3 className="feature-sub-heading">Secure</h3>
                    <p>Enjoy safe and reliable payment options for your bookings.</p>
                    <img src="../../../home-payments.avif" loading="lazy" alt=""/>
                </section>
            </section>
            <section className="mt-8 mx-16 flex justify-around sm:justify-center sm:m-6">
                {loggedInUser.id ? (
                    <Link to={`/breezer/${loggedInUser.id}`}>
                        <button className="btn btn-green sm:mx-4" id="text-base">
                            Sign In
                        </button>
                    </Link>
                ) : (
                    <Link to="/account">
                        <button className="btn btn-green sm:mx-4" id="text-base">
                            Sign In
                        </button>
                    </Link>
                )}
                <Link to="/events">
                    <button className="btn btn-salmon sm:mx-4" id="text-base">
                        Find Events
                    </button>
                </Link>
            </section>
            
            <section className="xl:max-w-[80vw] m-auto">
                <section className="sub-section">
                    <h4 className="feature-sub-heading">Discover Events</h4>
                    <p className="discover-sub-title">Explore upcoming events are secure your spot today!</p>
                </section>

                <ul className="mt-2 flex flex-wrap bg-[#FFB593] rounded-md p-1 lg:my-4 mx-auto max-w-[80rem]">
                    <li className="p-1 text-xs">
                        <button 
                            className="btn btn-tag" 
                            onClick={() => {
                                setEventTag("");
                                setActiveEventTag("View all");
                            }}
                            aria-label="View all events"
                        >
                            View all
                            {activeEventTag === "View all" && <p className="border-t-1"></p>}</button>
                    </li>
                    {tags.map((tag) => {
                        return (
                            <li className="p-1 text-xs"
                            key={tag.tag_id}>
                                <button 
                                    className="btn btn-tag" 
                                    value={tag.slug} 
                                    onClick={(event) => {
                                        setEventTag(event.target.value);
                                        setActiveEventTag(tag.name);
                                    }}
                                    aria-label={`View ${tag.name} events`}
                                >{tag.name}
                                    {tag.name === activeEventTag && <p className="border-t-1"></p>}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <section>
                {loading ? (
                    <p className="my-4 text-xs lg:text-base">Loading events...</p>
                ) : (
                    events.length ? (
                        <ul className="lg:flex lg:max-w-[80vw] mx-auto justify-center"
                        >
                        {events.map((event) => {
                            return (
                                <li className="bg-[#317575] text-white text-left p-2 rounded-md mt-3 mx-0 sm:p-4 lg:max-w-[25vw] lg:m-2 flex flex-col justify-between"
                                key={event.event_id}>
                                    <h4 className="font-semibold sm:text-xl">{event.title}</h4>
                                    <p className="mt-1 text-xs sm:text-base lg:text-xl">{event.event_overview}</p>
                                    <section className="my-1 flex justify-around items-center text-xs sm:text-base lg:flex flex-wrap">
                                        {event.price !== 0 ? (
                                            <p className="ticket-price">£{event.price}</p>
                                        ) : (
                                            <p className="bg-[#FFB593] text-black rounded-md py-1 px-3">FREE</p>
                                        )}
                                        <p className="font-semibold">{new Date(event.start_time).toDateString()}</p>
                                        <Link to={`/events/${event.event_id}`}>
                                            <button 
                                                className="btn btn-white"
                                                id="text-base"
                                                aria-label={`Find tickets for ${event.title}`}
                                            >Find Tickets
                                            </button>
                                        </Link>
                                    </section>
                                </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p className="my-4 text-xs lg:text-base"
                        >No events found. Please select another category.</p>
                    )
                )}
            </section>

            <section>
                <Link to="/events">
                    <button className="btn btn-salmon my-4 mx-auto" id="font-normal">
                        View More Events
                    </button>
                </Link>
            </section>
        </main>
    )
}