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
            setUpcomingEvents(updatedFutureEvents);
            setPastEvents(updatedPastEvents);
            setLoading(false);
        })
    }, []);

    if (loading) {
        return (
            <p>Loading your profile...</p>
        )
    }

    return (
        <section className="my-4 text-left">
            <h2 className="text-2xl xl:text-3xl">Your Tickets</h2>
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
            </section>

            <section>
                <ul className="lg:flex lg:flex-wrap lg:max-w-[80vw] xl:mx-auto xl:justify-left">
                    {activeTickets === "Upcoming" ? (
                        upcomingEvents.length ? (
                            upcomingEvents.map((event) => {
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
                                                <button className="btn btn-white">
                                                    View Event
                                                </button>
                                            </Link>
                                        </section>
                                    </li>
                                )
                            })
                        ) : (
                            <section className="my-4 mx-auto text-center text-xs xl:text-base xl:my-8">
                                <p>No Upcoming Events.</p>
                                <Link to="/events">
                                    <button className="!bg-[#317575] text-white mt-2">
                                        Find Events
                                    </button>
                                </Link>
                            </section>
                        )
                    ) : (
                        pastEvents.length ? (
                            pastEvents.map((event) => {
                                return (
                                    <li className="bg-[#317575] text-white text-left p-2 rounded-md mt-3 mx-0 sm:p-4 sm:w-[60vw] sm:mx-auto lg:max-w-[40vw] lg:m-2 flex flex-col justify-between xl:max-w-[35vw] 2xl:max-w-[25vw]"  
                                    key={event.event_id}>
                                        <h4 className="font-semibold sm:text-xl">{event.title}</h4>
                                        <section className="m-auto flex items-center max-h-[20vh] xl:min-h-[30vh]">
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
                                                <button className="btn btn-white">
                                                    View Event
                                                </button>
                                            </Link>
                                        </section>
                                    </li>
                                )
                            })
                        ) : (
                            <section className="w-[80vw] my-4 max-auto text-center text-xs xl:text-base xl:my-8">
                                <p>No Past Events.</p>
                            </section>
                        )
                    )} 
                </ul>
            </section>
        </section>
    )
}