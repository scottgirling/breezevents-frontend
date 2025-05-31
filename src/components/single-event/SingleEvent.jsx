import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById } from "../../utils/api";
import "./SingleEvent.css";

export const SingleEvent = () => {
    const { event_id } = useParams();
    const [event, setEvent] = useState({});
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        fetchEventById(event_id)
        .then((returnedEvent) => {
            setEvent(returnedEvent);
        })
    }, [])

    return (
        <>
            <h1 className="single-event-title">{event.title}</h1>
            <p className="single-event-overview">{event.event_overview}</p>
            <img className="event-image" src={event.event_image_url} />
            <section className="event-info">
                <p className="event-start-time">{new Date(event.start_time).toDateString()}</p>
                <p className="event-price">£{event.price}</p>
                <button className="btn-buy-tickets">Buy Tickets</button>
            </section>
            <section className="event-description">
                <p>Description</p>
                <button onClick={() => setShowDescription(!showDescription)}>
                    {!showDescription ? (
                        <i className="fa-solid fa-angle-down"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up"></i>
                    )}
                </button>
            </section>
            {showDescription && (
                <p>{event.description}</p>
            )}
        </>
    )
}