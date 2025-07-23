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
            });

            let updatedFutureEvents = [];
            eventsInTheFuture.map((event) => {
                const imgFileName = event.event_image_url && event.event_image_url.split("/")[9];
                return updatedFutureEvents.push({ ...event, event_image_url: imgFileName });
            });

            let updatedPastEvents = [];
            eventsInThePast.map((event) => {
                const imgFileName = event.event_image_url && event.event_image_url.split("/")[9];
                return updatedPastEvents.push({ ...event, event_image_url: imgFileName });
            });
            setUpcomingHostEvents(updatedFutureEvents);
            setPastHostEvents(updatedPastEvents);
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
        <section className="my-4 text-left">
            <section className="flex items-center justify-between mt-4 mb-1">
                <h2 className="text-2xl xl:text-3xl">Your Events</h2>
                <section className="text-xs xl:text-base">
                    <Link to={`/breezer/${user_id}/new-event`}>
                        <button className="flex items-center bg-inherit !p-0">
                            <i className="fa-solid fa-plus text-[#317575]"></i>
                            <p className="pl-1 text-[#317575]">Add Event</p>
                        </button>
                    </Link>
                </section>
            </section>
            <section className="flex text-sm xl:text-base">
                <button
                    className="bg-inherit !p-0 mr-3"
                    onClick={() => {
                        setActiveTickets("Upcoming");
                    }}
                >
                    {activeTickets === "Upcoming" ? (
                        <p className="underline">Upcoming Events</p>
                    ) : (
                        <p className="opacity-50">Upcoming Events</p>
                    )}
                </button>
                <button
                    className="bg-inherit !p-0 mr-3"
                    onClick={() => {
                        setActiveTickets("Past");
                    }}
                >
                    {activeTickets === "Past" ? (
                        <p className="underline">Past Events</p>
                    ) : (
                        <p className="opacity-50">Past Events</p>
                    )}
                </button>
                <button
                    className="bg-inherit !p-0 mr-3"
                    onClick={() => {
                        setActiveTickets("Draft");
                    }}
                >
                    {activeTickets === "Draft" ? (
                        <p className="underline">Draft Events</p>
                    ) : (
                        <p className="opacity-50">Draft Events</p>
                    )}
                </button>
            </section>

            <section>
                <ul className="lg:flex lg:flex-wrap lg:max-w-[80vw] xl:mx-auto xl:justify-left">
                    {activeTickets === "Upcoming" && (
                        upcomingHostEvents.length ? (
                            upcomingHostEvents.map((event) => {
                                return (
                                    <li className="bg-[#317575] text-white text-left p-2 rounded-md mt-3 mx-0 sm:p-4 sm:w-[60vw] sm:mx-auto lg:max-w-[40vw] lg:m-2 flex flex-col justify-between xl:max-w-[35vw] 2xl:max-w-[25vw]" 
                                    key={event.event_id}>
                                        <h4 className="font-semibold sm:text-xl">{event.title}</h4>
                                        <section className="m-auto flex items-center max-h-[20vh] min-h-[15vh] xl:min-h-[30vh]">
                                            <img 
                                                className="rounded-md max-h-[15vh] xl: w-auto xl:max-h-[25vh] xl:m-auto"
                                                src={`https://ik.imagekit.io/scott/${event.event_image_url}?tr=f-auto`}
                                                alt={`${event.title} event poster`} 
                                            />
                                        </section>
                                        <p className="mt-1 text-xs sm:text-base lg:text-xl lg:my-4">{event.event_overview}</p>
                                        <p id="event-date-left" className="event-price-date event-date">{new Date(event.start_time).toDateString()}</p>
                                        <section className="my-1 flex justify-around items-center text-xs sm:text-base lg:flex flex-wrap">
                                            <button 
                                                className="delete-event"
                                                onClick={() => setEventToDelete(event.event_id)}
                                                aria-label={`Delete ${event.title}`}
                                            >
                                                Delete Event
                                            </button>
                                            <Link to={`/breezer/${user_id}/${event.event_id}/update`}>
                                                <button className="btn btn-white"
                                                aria-label={`Update ${event.title}`}>
                                                    Update Event
                                                </button>
                                            </Link>
                                            <Link to={`/events/${event.event_id}`}>
                                                <button className="btn btn-white"
                                                aria-label={`View ${event.title}`}>
                                                    View Event
                                                </button>
                                            </Link>
                                        </section>
                                        <section>
                                            {event.event_id === eventToDelete && (
                                                <section>
                                                    <section className="my-2 mx-auto text-xs sm:text-base">
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
                            <section className="my-4 text-center text-xs xl:text-base xl:my-8">
                                <p>No Upcoming Events.</p>
                                <Link to={`/breezer/${user_id}/new-event`}>
                                    <button className="bg-[#317575] text-white mt-2">
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
                                    <li className="bg-[#317575] text-white text-left p-2 rounded-md mt-3 mx-0 sm:p-4 sm:w-[60vw] sm:mx-auto lg:max-w-[40vw] lg:m-2 flex flex-col justify-between xl:max-w-[35vw] 2xl:max-w-[25vw]" 
                                    key={event.event_id}>
                                        <h4 className="font-semibold sm:text-xl">{event.title}</h4>
                                        <section className="m-auto flex items-center max-h-[20vh] min-h-[15vh] xl:min-h-[30vh]">
                                            <img 
                                                className="rounded-md max-h-[15vh] xl: w-auto xl:max-h-[25vh] xl:m-auto"
                                                src={`https://ik.imagekit.io/scott/${event.event_image_url}?tr=f-auto`}
                                                alt={`${event.title} event poster`} 
                                            />
                                        </section>
                                        <p className="mt-1 text-xs sm:text-base lg:text-xl lg:my-4">{event.event_overview}</p>
                                        <section className="my-1 flex justify-around items-center text-xs sm:text-base lg:flex flex-wrap">
                                            {event.price !== 0 ? (
                                                <p className="ticket-price">£{event.price}</p>
                                            ) : (
                                                <p className="bg-[#FFB593] text-black rounded-md py-1 px-3">FREE</p>
                                            )}
                                            <p className="font-semibold">{new Date(event.start_time).toDateString()}</p>
                                            <Link 
                                                onClick={() => window.scroll(0,0)}
                                                to={`/events/${event.event_id}`}
                                            >
                                                <button className="btn btn-white"
                                                aria-label={`View ${event.title}`}>
                                                    View Event
                                                </button>
                                            </Link>
                                        </section>
                                    </li>
                                )
                            })
                        ) : (
                            <section className="my-4 text-center text-xs xl:text-base xl:my-8">
                                <p>No Past Events.</p>
                            </section>
                        )
                    )}

                    {activeTickets === "Draft" && (
                        draftEvents.length ? (
                            draftEvents.map((event) => {
                                return (
                                    <li className="bg-[#317575] text-white text-left p-2 rounded-md mt-3 mx-0 sm:p-4 sm:w-[60vw] sm:mx-auto lg:max-w-[40vw] lg:m-2 flex flex-col justify-between xl:max-w-[35vw] 2xl:max-w-[25vw]" 
                                    key={event.event_id}>
                                        <h4 className="font-semibold sm:text-xl">{event.title}</h4>
                                        <section className="m-auto flex items-center max-h-[20vh] min-h-[15vh] xl:min-h-[30vh]">
                                            <img 
                                                className="rounded-md max-h-[15vh] xl: w-auto xl:max-h-[25vh] xl:m-auto"
                                                src={`https://ik.imagekit.io/scott/${event.event_image_url}?tr=f-auto`}
                                                alt={`${event.title} event poster`} 
                                            />
                                        </section>
                                        <p className="mt-1 text-xs sm:text-base lg:text-xl lg:my-4">{event.event_overview}</p>
                                        <p id="event-date-left" className="event-price-date event-date">{new Date(event.start_time).toDateString()}</p>
                                        <section className="my-1 flex justify-around items-center text-xs sm:text-base lg:flex flex-wrap">
                                            <button 
                                            className="delete-event"
                                            onClick={() => setEventToDelete(event.event_id)}
                                            aria-label={`Delete ${event.title}`}
                                            >
                                                Delete Event
                                            </button>
                                            <Link to={`/breezer/${user_id}/${event.event_id}/update`}>
                                                <button className="btn btn-white"
                                                aria-label={`Update ${event.title}`}>
                                                    Update Event
                                                </button>
                                            </Link>
                                        </section>
                                        <section>
                                            {event.event_id === eventToDelete && (
                                                <section>
                                                    <section className="my-2 mx-auto text-xs sm:text-base">
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
                            <section className="my-4 text-center text-xs xl:text-base xl:my-8">
                                <p>No Draft Events.</p>
                            </section>
                        )
                    )} 
                </ul>
            </section>
        </section>
    )
}