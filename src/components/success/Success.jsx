import { Link, useSearchParams } from "react-router-dom";
import { fetchSessionData } from "../../utils/api";
import { useEffect, useState } from "react";
import "./Success.css";
import { useAuth } from "../../contexts/AuthProvider";

export const Success = () => {
    const { loggedInUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState({});
    const [event, setEvent] = useState({});
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setLoading(true);
        const sessionID = searchParams.get("session_id");
        fetchSessionData(sessionID)
        .then((returnedData) => {
            setCustomer(returnedData.customer_details);
            setEvent(JSON.parse(returnedData.metadata.eventDetails));
        })
        .catch(() => {
            setError("Failed to confirm your booking.");
        });
        setLoading(false);
    }, []);

    const generateGoogleCalendarUrl = ({ title, description, location, startDateTime, endDateTime }) => {

        const formatDate = (date) => {
            let formattedDate = "";
            if (startDateTime || endDateTime) {
                formattedDate = date.replaceAll("-", "").replaceAll(":", "");
            }
            return formattedDate;
        }

        const url = new URL("https://calendar.google.com/calendar/render");
        url.searchParams.set("action", "TEMPLATE")
        url.searchParams.set("text", title);
        url.searchParams.set("details", description);
        url.searchParams.set("location", location);
        url.searchParams.set("dates", `${formatDate(startDateTime)}/${formatDate(endDateTime)}`);

        return url.toString();
    }

    const calendarUrl = generateGoogleCalendarUrl({
        title: event.title,
        description: event.event_overview,
        location: `${event.venue_name}, ${event.location}`,
        startDateTime: event.start_time,
        endDateTime: event.end_time
    });

    const route = loggedInUser.name ? `/breezer/${loggedInUser.id}` : "/account";

    if (loading) {
        return (
            <p className="loading">Loading...</p>
        )
    }

    if (error) {
        return (
            <section className="error">
                <p>{error}</p>
                <Link to={route}>
                    <button>Your Account</button>
                </Link>
            </section>
        )
    }

    {event && (
        <section className="success">
            <section>
            {customer.name ? (
                <h1 className="confirmation">Booking confirmed, {loggedInUser.name}!</h1>
            ) : (
                <h1 className="confirmation">Booking Confirmed!</h1>
            )}
            <p>You're going to: <span className="session-info">{event.title}</span></p>
            <p>A confirmation email will be sent to <span className="session-info">{customer.email}</span></p>
            </section>
            <section className="calendar">
            <section>
            <i className="fa-regular fa-calendar-check"></i>
            <p>{new Date(event.start_time).toDateString()}</p>
            </section>
            <Link target="_blank" to={calendarUrl}>
            <button className="google-calendar-button">
            Add to Google Calendar
            </button>
            </Link>
            </section>
            
            <section>
                <Link to={`/breezer/${loggedInUser.id}`}>
                    <button className="view-events-button">
                        View My Events
                    </button>
                </Link>
            </section>
        </section>
    )}
}