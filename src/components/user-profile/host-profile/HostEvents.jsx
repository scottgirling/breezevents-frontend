import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteEvent, fetchEventsByHostId } from "../../../utils/api";

export const HostEvents = () => {
    const { user_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [upcomingHostEvents, setUpcomingHostEvents] = useState([]);
    const [pastHostEvents, setPastHostEvents] = useState([]);
    const [draftEvents, setDraftEvents] = useState([]);
    const [activeTickets, setActiveTickets] = useState("Upcoming");
    const [eventToDelete, setEventToDelete] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchEventsByHostId(user_id)
        .then((returnedEvents) => {
            console.log(returnedEvents, "<--- returnedEvents")
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

    const handleDeleteEvent = (event_id) => {
        deleteEvent(event_id);
        window.location.reload();
    }

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
                                        <p id="event-date-left" className="event-price-date event-date">{new Date(event.start_time).toDateString()}</p>
                                        <section className="event-price-date">
                                            <button 
                                                className="delete-event"
                                                onClick={() => setEventToDelete(event.event_id)}
                                            >
                                                Delete Event
                                            </button>
                                            <Link to={`/breezer/${user_id}/${event.event_id}/update`}>
                                                <button className="btn btn-white">
                                                    Update Event
                                                </button>
                                            </Link>
                                            <Link to={`/events/${event.event_id}`}>
                                                <button className="btn btn-white">
                                                    View Event
                                                </button>
                                            </Link>
                                        </section>
                                        <section>
                                            {event.event_id === eventToDelete && (
                                                <section>
                                                    <section className="check-delete">
                                                        <p>Are you sure you want to delete this event?</p>
                                                        <p className="bold">This action cannot be undone.</p>
                                                    </section>
                                                    <section className="delete-buttons">
                                                        <button 
                                                            className="btn btn-delete-no"
                                                            onClick={() => setEventToDelete(null)}
                                                        >
                                                            No
                                                        </button>
                                                        <button 
                                                            className="btn btn-white"
                                                            onClick={() => handleDeleteEvent(event.event_id)}
                                                        >
                                                            Yes
                                                        </button>
                                                    </section>
                                                </section>
                                            )}
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
                                        <p id="event-date-left" className="event-price-date event-date">{new Date(event.start_time).toDateString()}</p>
                                        <section id="space-between" className="event-price-date">
                                            <button 
                                                className="delete-event"
                                                onClick={() => setEventToDelete(event.event_id)}
                                            >
                                                Delete Event
                                            </button>
                                            <Link to={`/breezer/${user_id}/${event.event_id}/update`}>
                                                <button className="btn btn-white">
                                                    Update Event
                                                </button>
                                            </Link>
                                        </section>
                                        <section>
                                            {event.event_id === eventToDelete && (
                                                <section>
                                                    <section className="check-delete">
                                                        <p>Are you sure you want to delete this event?</p>
                                                        <p className="bold">This action cannot be undone.</p>
                                                    </section>
                                                    <section className="delete-buttons">
                                                        <button 
                                                            className="btn btn-delete-no"
                                                            onClick={() => setEventToDelete(null)}
                                                        >
                                                            No
                                                        </button>
                                                        <button 
                                                            className="btn btn-white"
                                                            onClick={() => handleDeleteEvent(event.event_id)}
                                                        >
                                                            Yes
                                                        </button>
                                                    </section>
                                                </section>
                                            )}
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