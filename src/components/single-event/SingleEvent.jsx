import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, fetchHostById } from "../../utils/api";
import "./SingleEvent.css";

export const SingleEvent = () => {
    const { event_id } = useParams();
    const [event, setEvent] = useState({});
    const [venue, setVenue] = useState({});
    const [host, setHost] = useState({});
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
            return fetchHostById(6)
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
                <button className="btn-buy-tickets">Buy Tickets</button>
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