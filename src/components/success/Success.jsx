import { Link, useSearchParams } from "react-router-dom";
import { fetchSessionData } from "../../utils/api";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import "./Success.css";

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
            console.log(returnedData, "<")
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
            <p className="loading sm:min-h-[70vh]">Loading...</p>
        )
    }
    
    if (error) {
        return (
            <section className="min-h-[60vh] m-8 sm:min-h-[70vh] 2xl:my-20 2xl:min-h-[60vh]">
                <h1 className="2xl:text-xl">{error}</h1>
                <Link to={route}>
                    <button className="your-account-btn">Your Account</button>
                </Link>
            </section>
        )
    }

    return (
        <section className="my-4 min-h-[60vh] sm:min-h-[70vh] 2xl:my-20 2xl:min-h-[60vh]">
            <section>
                {customer.name ? (
                    <h1 className="text-2xl mb-4">Booking confirmed, {loggedInUser.name}!</h1>
                ) : (
                    <h1 className="text-2xl mb-4">Booking Confirmed!</h1>
                )}
                <p className="mt-2">You're going to: <span className="font-semibold">{event.title}</span></p>
                <p className="mt-2">A confirmation email will be sent to <span className="session-info">{customer.email}</span></p>
            </section>

            <section className="flex flex-col mt-8 mb-4">
                <i className="fa-regular fa-calendar-check text-3xl"></i>
                <p>{new Date(event.start_time).toDateString()}</p>
                <Link target="_blank" to={calendarUrl}>
                    <button className="calendar-btn">
                        Add to Google Calendar
                    </button>
                </Link>
            </section>
            
            <section>
                <Link to={`/breezer/${loggedInUser.id}`}>
                    <button className="view-events-btn">
                        View My Events
                    </button>
                </Link>
            </section>
        </section>
    )
}