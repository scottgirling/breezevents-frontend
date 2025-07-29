import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchEventById, startCheckoutSession } from "../../utils/api";
import { useAuth } from "../../contexts/AuthProvider";
import { NotFound } from "../not-found/NotFound";
import "./SingleEvent.css";

export const SingleEvent = () => {
    const { loggedInUser } = useAuth();
    const { event_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({});
    const [showTicketQuantity, setShowTicketQuantity] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(2);
    const [showEventDescription, setShowEventDescription] = useState(false);
    const [showVenueDetails, setShowVenueDetails] = useState(false);
    const [showHostDetails, setShowHostDetails] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchEventById(event_id)
        .then((returnedEvent) => {
            const imgFileName = returnedEvent.event_image_url.split("/")[9];
            setEvent({ ...returnedEvent, event_image_url: imgFileName });
        })
        .catch((error) => {
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <p className="loading">Loading event...</p>
        )
    }

    if (error) {
        return (
            <NotFound />
        );
    }

    return (
        <section className="sm:min-h-[70vh] xl:mx-12 2xl:mx-24">
            <h1 className="mt-4 text-[#317575] text-2xl font-medium sm:text-3xl xl:text-4xl">{event.title}</h1>
            <p className="mt-1 text-black text-xs sm:text-base xl:m-2 xl:text-xl">{event.event_overview}</p>
            <section className="flex flex-col justify-center min-h-[20vh] sm:min-h-[30vh]">
                <img className="my-4 mx-auto rounded-md max-w-[75vw] sm:w-[60vw] xl:w-[50vw]"
                    src={`https://ik.imagekit.io/scott/${event.event_image_url}?v=${event.last_updated_at}&tr=f-auto`}
                    alt={`${event.title} event poster`}
                />
            </section>
            <section className="flex bg-[#317575] rounded-md text-white justify-around p-1 text-xs items-center font-medium xl:my-8 xl:text-xl xl:p-3">
                <p className="event-start-time">{new Date(event.start_time).toDateString()}</p>
                {event.price !== 0 ? (
                    <p className="ticket-price">£{event.price}</p>
                ) : (
                    <p className="free-ticket">FREE</p>
                )}
                <button 
                    className="btn-buy-tickets"
                    onClick={() => {
                        setShowTicketQuantity(!showTicketQuantity);
                        if ((event.capacity - event.attendees_count) < 6) {
                            setTicketQuantity(1);
                        }
                    }}
                    disabled={(event.attendees_count >= event.capacity)}
                    id={(event.attendees_count >= event.capacity) && "opacity-50"}
                >
                    {(event.attendees_count >= event.capacity) ? (
                        <p>SOLD OUT</p>
                    ) : (
                        <p>Buy Tickets</p>
                    )}
                </button>
            </section>

            <section>
                {showTicketQuantity && (
                    <section>
                        {(event.capacity - event.attendees_count) < 6 && (
                            <p className="text-xs mt-4">Due to a very limited number of tickets remaining, customers are restricted to one ticket with each purchase.</p>
                        )}
                        {(event.capacity - event.attendees_count) >= 6 && (
                            <section className="flex pt-4 m-auto w-max text-sm xl:text-base xl:mt-[-1.5rem]">
                                <p>Select quantity:</p>
                                <select 
                                    className="w-[2.5rem] bg-white ml-2" 
                                    defaultValue="2" 
                                    name="quantity" 
                                    id="quantity"
                                    onChange={(event) => setTicketQuantity(event.target.value)}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </section>
                        )}

                        <section className="flex pt-4 w-max m-auto items-center text-xs xl:text-base">
                            <section className="ticket-quantity-price mx-2">
                                {(event.capacity - event.attendees_count) < 6 ? (
                                    <p>1 Ticket</p>
                                ) : (
                                    <p>{ticketQuantity} Ticket(s)</p>
                                )}
                                {event.price !== 0 && (
                                    <p>£{event.price * ticketQuantity}</p>
                                )}
                            </section>
                            {loggedInUser.id ? (
                                <button 
                                    className="get-tickets-button"
                                    onClick={() => {
                                        startCheckoutSession(event, ticketQuantity, loggedInUser.id);
                                    }}
                                >
                                    <p>Buy Now</p>
                                </button>
                            ) : (
                                <section className="mx-2">
                                    <p className="mb-1">Sign In To Book</p>
                                    <Link to="/account"
                                        onClick={() => window.scroll(0,0)}
                                    >
                                        <button className="btn btn-green sm:mx-4">
                                            Sign In
                                        </button>
                                    </Link>
                                </section>
                            )}
                        </section>
                    </section>
                )}
            </section>

            <section className="flex justify-between items-center mt-4 bg-[#317575] text-white py-1 px-4 font-medium rounded-md rounded-b-none xl:text-2xl xl:py-2 xl:px-8">
                <p>Description</p>
                <button 
                    className="event-details-bar-button"
                    onClick={() => setShowEventDescription(!showEventDescription)}
                    aria-label="View event description"
                >
                    {!showEventDescription ? (
                        <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up" aria-hidden="true"></i>
                    )}
                </button>
            </section>

            <section>
                {showEventDescription && (
                    <section className="m-4 text-xs xl:text-xl xl:w-[75vw] xl:my-4 xl:mx-auto">
                        <p className="my-3 mx-auto xl:my-4">{event.description}</p>
                        <p className="my-3 mx-auto xl:my-4">Start Time: {event.start_time.replace("Z", "").split("T")[1]} {new Date(event.start_time).toDateString()} </p>
                        <p className="my-3 mx-auto xl:my-4">End Time: {event.end_time.replace("Z", "").split("T")[1]} {new Date(event.end_time).toDateString()}</p>
                    </section>
                )}
            </section>

            <section className="flex justify-between items-center bg-[#317575] text-white py-1 px-4 font-medium xl:text-2xl xl:py-2 xl:px-8">
                <p>Venue</p>
                <button 
                    className="event-details-bar-button"
                    onClick={() => setShowVenueDetails(!showVenueDetails)}
                    aria-label="View venue details"
                >
                    {!showVenueDetails ? (
                        <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up" aria-hidden="true"></i>
                    )}
                </button>
            </section>

            <section className="text-xs xl:text-base">
                {showVenueDetails && (
                    event.venue_id === 7 ? (
                        <section className="my-4">  
                            <p className="m-2 xl:my-4">This is an online event.</p>
                            <p className="m-2 xl:my-4">Upon confirming your place at this event you will receive more information on how to attend virtually!</p>
                        </section>
                    ) : (
                        <section>
                            <section className="my-4">
                                <p className="text-sm font-bold xl:text-xl xl:my-4">Address</p>
                                <p className="m-4 xl:text-xl xl:w-[75vw] xl:my-4 xl:mx-auto">{event.venue_name}, {event.location}</p>
                            </section>

                            <section className="my-4">
                                <p className="text-sm font-bold m-2 xl:text-xl xl:my-4">Facilities</p>
                                <section>
                                    <ul className="flex flex-wrap justify-center">
                                        {event.facilities.map((facility) => {
                                            return (
                                                <li 
                                                    className="m-2 border-1 border-[#317575] rounded-md p-2"
                                                    key={event.facilities.indexOf(facility)}
                                                >
                                                    {facility}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </section>
                            </section>

                            <section className="text-sx my-4">
                                <p className="text-sm font-bold m-2 xl:text-xl xl:my-4">Accessibility</p>
                                <section>
                                    <ul className="flex flex-wrap justify-center">
                                        {event.accessibility_features.map((feature) => {
                                            return (
                                                <li 
                                                    className="m-2 border-1 border-[#317575] rounded-md p-2"
                                                    key={event.accessibility_features.indexOf(feature)}
                                                >
                                                    {feature}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </section>
                            </section>

                            <section className="text-sx my-4">
                                <p className="text-sm font-bold m-2 xl:text-xl xl:my-4">Contact</p>
                                <p className="m-2 xl:my-4">{event.website_url}</p>
                                <p className="m-2 xl:my-4">{event.contact_email}</p>
                                <p className="m-2 xl:my-4">{event.contact_phone}</p>
                            </section>
                        </section>
                    )
                )}
            </section>

            <section className="flex justify-between items-center bg-[#317575] text-white py-1 px-4 font-medium rounded-b-md xl:text-2xl xl:py-2 xl:px-8">
                <p>Host</p>
                <button 
                    className="event-details-bar-button"
                    onClick={() => setShowHostDetails(!showHostDetails)}
                    aria-label="View host details"
                >
                    {!showHostDetails ? (
                        <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up" aria-hidden="true"></i>
                    )}
                </button>
            </section>
            <section>
                {showHostDetails && (
                    <section>
                        <p className="m-4 text-xs xl:text-xl xl:w-[75vw] xl:my-4 xl:mx-auto">{event.title} is hosted by <span className="font-bold">{event.name}.</span></p>
                        <p className="m-4 text-xs xl:text-xl xl:w-[75vw] xl:my-4 xl:mx-auto">A bit about {event.name}: <span className="font-bold">{event.bio}</span></p>
                        <p className="m-4 text-xs xl:text-xl xl:w-[75vw] xl:my-4 xl:mx-auto">Should you need to contact {event.name}: <span className="font-bold">{event.email}</span></p>
                    </section>
                )}
            </section>
        </section>
    )
}