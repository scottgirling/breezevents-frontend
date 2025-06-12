import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AmendEvent.css";
import { fetchEventById } from "../../utils/api";

export const AmendEvent = () => {
    const { event_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({});
    const [eventDetails, setEventDetails] = useState({
        title: null,
        event_overview: null,
        description: null,
        start_time: null,
        end_time: null,
        timezone: null,
        venue_id: null,
        is_online: null,
        event_type: null,
        capacity: null,
        is_free: null,
        price: null,
        event_image_url: null,
        is_published: null
    });

    useEffect(() => {
        setLoading(true);
        fetchEventById(event_id)
        .then((returnedEvent) => {
            setEvent(returnedEvent)
            setLoading(false);
        })
    }, []);

    if (loading) {
        return (
            <p>Loading event...</p>
        )
    }

    console.log(event, "<-- event")

    return (
        <section>
            <form>
                <label htmlFor="title">Event title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder={event.title}>
                </input>
            </form>
        </section>
    )
}