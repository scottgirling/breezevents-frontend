import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
            setEvent(returnedEvent);
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
        <section className="single-event">
            <h1 className="single-event-title">{event.title}</h1>
            <p className="single-event-overview">{event.event_overview}</p>
            <img 
                className="event-image" 
                src={`${event.event_image_url}?v=${Date.now()}`}
                alt={`${event.title} event poster`}
            />
            <section className="event-info">
                <p className="event-start-time">{new Date(event.start_time).toDateString()}</p>
                {event.price !== 0 ? (
                    <p className="ticket-price">£{event.price}</p>
                ) : (
                    <p className="free-ticket">FREE</p>
                )}
                <button onClick={() => setShowTicketQuantity(!showTicketQuantity)}className="btn-buy-tickets">Buy Tickets</button>
            </section>

            <section>
                {showTicketQuantity && (
                    <>
                    <section className="quantity-section">
                        <p>Select quantity:</p>
                        <select onChange={(event) => setTicketQuantity(event.target.value)}className="drop-down-quantity-box" defaultValue="2" name="quantity" id="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </section>
                    <section className="get-tickets">
                        <section className="ticket-quantity-price">
                            <p>{ticketQuantity} Tickets</p>
                            {event.price !== 0 && (
                                <p>£{event.price * ticketQuantity}</p>
                            )}
                        </section>
                        <button 
                            className="get-tickets-button"
                            onClick={() => {
                                startCheckoutSession(event, ticketQuantity, loggedInUser.id);
                            }}
                        >
                            Get Tickets
                        </button>
                    </section>
                    </>
                )}
            </section>

            <section className="event-description-bar">
                <p>Description</p>
                <button 
                onClick={() => setShowEventDescription(!showEventDescription)}
                aria-label="View event description">
                    {!showEventDescription ? (
                        <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up" aria-hidden="true"></i>
                    )}
                </button>
            </section>

            <section>
                {showEventDescription && (
                    <section className="text-showing">
                        <p>{event.description}</p>
                        <p>Start Time: {event.start_time.replace("Z", "").split("T")[1]} {new Date(event.start_time).toDateString()} </p>
                        <p>End Time: {event.end_time.replace("Z", "").split("T")[1]} {new Date(event.end_time).toDateString()}</p>
                    </section>
                )}
            </section>

            <section className="venue-bar">
                <p>Venue</p>
                <button 
                onClick={() => setShowVenueDetails(!showVenueDetails)}
                aria-label="View venue details">
                    {!showVenueDetails ? (
                        <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up" aria-hidden="true"></i>
                    )}
                </button>
            </section>

            <section>
                {showVenueDetails && (
                    event.venue_id === 7 ? (
                        <section className="venue-details">  
                            <p>This is an online event.</p>
                            <p>Upon confirming your place at this event you will receive more information on how to attend virtually!</p>
                        </section>
                    ) : (
                        <section>
                            <section className="venue-details">
                                <p className="venue-subtitle">Address</p>
                                <p className="text-showing">{event.venue_name}, {event.location}</p>
                            </section>

                            <section className="venue-details">
                                <p className="venue-subtitle">Facilities</p>
                                <section className="facilities-list">
                                    <ul>
                                        {event.facilities.map((facility) => {
                                            return (
                                                <li className="facility" key={event.facilities.indexOf(facility)}>{facility}</li>
                                            )
                                        })}
                                    </ul>
                                </section>
                            </section>

                            <section className="venue-details">
                                <p className="venue-subtitle">Accessibility</p>
                                <section className="accessibility-list">
                                    <ul>
                                        {event.accessibility_features.map((feature) => {
                                            return (
                                                <li className="accessibility" key={event.accessibility_features.indexOf(feature)}>{feature}</li>
                                            )
                                        })}
                                    </ul>
                                </section>
                            </section>

                            <section className="venue-details">
                                <p className="venue-subtitle">Contact details:</p>
                                <p>{event.website_url}</p>
                                <p>{event.contact_email}</p>
                                <p>{event.contact_phone}</p>
                            </section>
                        </section>
                    )
                )}
            </section>

            <section className="host-bar">
                <p>Host</p>
                <button 
                onClick={() => setShowHostDetails(!showHostDetails)}
                aria-label="View host details">
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
                        <p className="text-showing">{event.title} is hosted by <span className="host-info">{event.name}.</span></p>
                        <p className="text-showing">A bit about {event.name}: <span className="host-info">{event.bio}</span></p>
                        <p className="text-showing">Should you need to contact {event.name}: <span className="host-info">{event.email}</span></p>
                    </section>
                )}
            </section>
        </section>
    )
}