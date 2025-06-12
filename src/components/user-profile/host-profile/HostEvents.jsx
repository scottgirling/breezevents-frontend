import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchEventsByHostId } from "../../../utils/api";

export const HostEvents = () => {
    const { user_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [upcomingHostEvents, setUpcomingHostEvents] = useState([]);
    const [pastHostEvents, setPastHostEvents] = useState([]);
    const [draftEvents, setDraftEvents] = useState([]);
    const [activeTickets, setActiveTickets] = useState("Upcoming");

    useEffect(() => {
        setLoading(true);
        fetchEventsByHostId(user_id)
        .then((returnedEvents) => {
            const draftEvents = [];
            const publishedEvents = returnedEvents.filter((event) => {
                if (event.is_published === false) {
                    draftEvents.push(event);
                    return;
                }
                return event;
            })
            setDraftEvents(draftEvents);
            return publishedEvents
        })
        .then((publishedEvents) => {
            const updatedEvents = publishedEvents.map((event) => {
                console.log(event, "<--- event")
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
            setUpcomingHostEvents(eventsInTheFuture);
            setPastHostEvents(eventsInThePast);
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
            <section className="profile-header">
                <h2>Your Events</h2>
                <section className="your-profile-button">
                    <Link to={`/breezer/${user_id}/new-event`}>
                        <button className="your-profile-button">
                            <i className="fa-solid fa-plus"></i>
                            <p>Add Event</p>
                        </button>
                    </Link>
                </section>
            </section>
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
                <button
                    onClick={() => {
                        setActiveTickets("Draft");
                    }}
                >
                    {activeTickets === "Draft" ? (
                        <p className="active-button">Draft Events</p>
                    ) : (
                        <p className="inactive-button">Draft Events</p>
                    )}
                </button>
            </section>

            <section>
                <ul>
                    {activeTickets === "Upcoming" && (
                        upcomingHostEvents.length ? (
                            upcomingHostEvents.map((event) => {
                                return (
                                    <li className="event-card" key={event.event_id}>
                                        <h4 className="event-title">{event.title}</h4>
                                        <p className="event-overview">{event.event_overview}</p>
                                        <section className="event-price-date">
                                            <p className="event-date">{new Date(event.start_time).toDateString()}</p>
                                            <Link to={`/breezer/${user_id}/${event.event_id}/amend`}>
                                                <button className="btn btn-white">
                                                    Edit Event
                                                </button>
                                            </Link>
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
                                <Link to={`/breezer/${user_id}/new-event`}>
                                    <button>
                                        Add Event
                                    </button>
                                </Link>
                            </section>
                        )
                    )}

                    {activeTickets === "Past" && (
                        pastHostEvents.length ? (
                            pastHostEvents.map((event) => {
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

                    {activeTickets === "Draft" && (
                        draftEvents.length ? (
                            draftEvents.map((event) => {
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
                                            <button className="btn btn-white">
                                                Edit Event
                                            </button>
                                            <button
                                                className="btn btn-white">
                                                Post Event
                                            </button>
                                        </section>
                                    </li>
                                )
                            })
                        ) : (
                            <section className="no-past-events">
                                <p>No Draft Events.</p>
                            </section>
                        )
                    )} 
                </ul>
            </section>
        </section>
    )
}