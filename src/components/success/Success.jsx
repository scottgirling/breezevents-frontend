import { Link, useSearchParams } from "react-router-dom";
import { fetchSessionData } from "../../utils/api";
import { useEffect, useState } from "react";
import "./Success.css";
import { useAuth } from "../../contexts/AuthProvider";

export const Success = () => {
    const { loggedInUser } = useAuth();
    console.log(loggedInUser, "<<<<<")
    const [customer, setCustomer] = useState({});
    const [event, setEvent] = useState({});
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const sessionID = searchParams.get("session_id");
        fetchSessionData(sessionID)
        .then((returnedData) => {
            setCustomer(returnedData.customer_details);
            setEvent(JSON.parse(returnedData.metadata.eventDetails));
        });
    }, []);

    return (
        <section className="success">
            <section>
                {customer.name ? (
                    <h1 className="confirmation">Booking confirmed, {customer.name}!</h1>
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
                <button>
                    Add to Google Calendar
                </button>
            </section>

            <section>
                <Link to={`/breezer/${loggedInUser.id}`}>
                    <button className="view-events-button">
                        View My Events
                    </button>
                </Link>
            </section>
        </section>
    )
}