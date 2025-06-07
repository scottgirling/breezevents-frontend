import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchEventsByUserId } from "../../../utils/api";

export const AttendeeEvents = () => {
    const { user_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [activeTickets, setActiveTickets] = useState("Upcoming");

    useEffect(() => {
        fetchEventsByUserId(user_id)
        .then((returnedEvents) => {
            const updatedEvents = returnedEvents.map((event) => {
                const today = new Date();
                const eventDate = new Date(event.end_time)
                const isUpcoming = today < eventDate;
                return { ...event, isUpcoming }
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

    if (loading) {
        return (
            <p>Loading your profile...</p>
        )
    }

    return (
        <section className="profile-section">
            <h2>Your Tickets</h2>
            <section className="upcoming-past">
                <button
                    onClick={() => {
                        setActiveTickets("Upcoming");
                    }}
                >
                    {activeTickets === "Upcoming" ? (
                        <p className="active-button">Upcoming Events</p>
                    ) : (
                        <p className="inactive-button">Upcoming Events</p>
                    )}
                </button>
                <button
                    onClick={() => {
                        setActiveTickets("Past");
                    }}
                >
                    {activeTickets === "Past" ? (
                        <p className="active-button">Past Events</p>
                    ) : (
                        <p className="inactive-button">Past Events</p>
                    )}
                </button>
            </section>

            <section>
                <ul>
                    {activeTickets === "Upcoming" ? (
                        upcomingEvents.length ? (
                            upcomingEvents.map((event) => {
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
                                                    View Event
                                                </button>
                                            </Link>
                                        </section>
                                    </li>
                                )
                            })
                        ) : (
                            <section className="no-past-events">
                                <p>No Upcoming Events.</p>
                                <Link to="/events">
                                    <button>
                                        Find Events
                                    </button>
                                </Link>
                            </section>
                        )
                    ) : (
                        pastEvents.length ? (
                            pastEvents.map((event) => {
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
                                                    View Event
                                                </button>
                                            </Link>
                                        </section>
                                    </li>
                                )
                            })
                        ) : (
                            <section className="no-past-events">
                                <p>No Past Events.</p>
                            </section>
                        )
                    )} 
                </ul>
            </section>
        </section>
    )
}