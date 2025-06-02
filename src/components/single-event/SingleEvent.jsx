import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, fetchHostById } from "../../utils/api";
import "./SingleEvent.css";

export const SingleEvent = () => {
    const { event_id } = useParams();
    const [event, setEvent] = useState({});
    const [venue, setVenue] = useState({});
    const [host, setHost] = useState({});
    const [showTicketQuantity, setShowTicketQuantity] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(2);
    const [showEventDescription, setShowEventDescription] = useState(false);
    const [showVenueDetails, setShowVenueDetails] = useState(false);
    const [showHostDetails, setShowHostDetails] = useState(false);

    useEffect(() => {
        fetchEventById(event_id)
        .then((returnedEvent) => {
            setEvent(returnedEvent);
        })
        // .then(() => {
        //     fetchVenueById(event.venue_id)
        // })
        // .then((returnedVenue) => {
        //     setVenue(returnedVenue);
        // })
        .then(() => {
            return fetchHostById(event.host_id)
        })
        .then((returnedHost) => {
            setHost(returnedHost)
        })
    }, []);

    return (
        <>
            <h1 className="single-event-title">{event.title}</h1>
            <p className="single-event-overview">{event.event_overview}</p>
            <img className="event-image" src={event.event_image_url} />
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
                        <button className="get-tickets-button">
                            Get Tickets
                        </button>
                    </section>

                    </>
                )}
            </section>

            <section className="event-description-bar">
                <p>Description</p>
                <button onClick={() => setShowEventDescription(!showEventDescription)}>
                    {!showEventDescription ? (
                        <i className="fa-solid fa-angle-down"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up"></i>
                    )}
                </button>
            </section>
            <section>
                {showEventDescription && (
                    <p className="text-showing">{event.description}</p>
                )}
            </section>
            <section className="venue-bar">
                <p>Venue</p>
                <button onClick={() => setShowVenueDetails(!showVenueDetails)}>
                    {!showVenueDetails ? (
                        <i className="fa-solid fa-angle-down"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up"></i>
                    )}
                </button>
            </section>
            <section className="host-bar">
                <p>Host</p>
                <button onClick={() => setShowHostDetails(!showHostDetails)}>
                    {!showHostDetails ? (
                        <i className="fa-solid fa-angle-down"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up"></i>
                    )}
                </button>
            </section>
            <section>
                {showHostDetails && (
                    <>
                        <p className="text-showing">{event.title} is hosted by <span className="host-info">{host.name}.</span></p>
                        <p className="text-showing">A bit about {host.name}: <span className="host-info">{host.bio}</span></p>
                        <p className="text-showing">Should you need to contact {host.name}: <span className="host-info">{host.email}</span></p>
                    </>
                )}
            </section>
        </>
    )
}