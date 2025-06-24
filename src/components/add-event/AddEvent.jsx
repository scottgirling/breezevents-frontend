import { useEffect, useState } from "react";
import "./AddEvent.css";
import { addEvent, addEventTag, fetchTags, fetchVenues } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

export const AddEvent = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [venues, setVenues] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const [isFree, setIsFree] = useState(false);
    const [isTicketPriceDisabled, setIsTicketPriceDisabled] = useState(false);
    const [isVenueSelectDisabled, setIsVenueSelectDisabled] = useState(true);
    const [eventDetails, setEventDetails] = useState({
        title: null,
        event_overview: null,
        description: null,
        start_time: null,
        end_time: null,
        timezone: null, 
        venue_id: 7,
        is_online: isOnline,
        host_id: user_id,
        event_type: null,
        capacity: null,
        is_free: isFree,
        price: null,
        event_image_url: null,
        is_published: true
    });
    const [newEventTag, setNewEventTag] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchTags()
        .then((returnedTags) => {
            setTags(returnedTags);
        })
        fetchVenues()
        .then((returnedVenues) => {
            const validVenues = [];
            returnedVenues.map((venue) => {
                venue.venue_name !== "online_event" && validVenues.push(venue);
            });
            setVenues(validVenues);
            setLoading(false);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const generatedslug = eventDetails.title.replaceAll(" ", "-").toLowerCase();
        addEvent({ ...eventDetails, slug: generatedslug })
        .then((returnedEvent) => {
            addEventTag({ event_id: returnedEvent.event_id, tag_id: newEventTag })
        })
        .then(() => {
            navigate(`/breezer/${user_id}`);
        })
    }

    const handleEventDetailsUpdate = (event) => {
        const eventDetailKeys = Object.keys(eventDetails);
        const updatedEventDetails = eventDetailKeys.map((key) => {
            if (key === event.target.name) {
                setEventDetails({...eventDetails, [key]: event.target.value })
            }
            if (event.target.name === "is_online" && event.target.value === "true") {
                setEventDetails({ ...eventDetails, is_online: true, venue_id: 7 });
            }
            if (event.target.name === "is_free" && event.target.value === "true") {
                setEventDetails({ ...eventDetails, is_free: true, price: 0 });
            }
            if (event.target.name === "is_published") {
                setEventDetails({ ...eventDetails, [key]: event.target.value })
                if (eventDetails.is_published === false) {
                    handleSubmit();
                }
                
            }
        });
        return updatedEventDetails;
    }

    const handleVenueSelectClassName = () => {
        if (isVenueSelectDisabled === true) {
            return "form-input-disabled";
        }
    }

    const handleTicketPriceClassName = () => {
        if (isTicketPriceDisabled === true) {
            return "form-input-disabled";
        }
    }

    if (loading) {
        return (
            <p className="loading">Loading...</p>
        )
    }

    return (
        <section className="upload-event">
            <h1 className="add-event-title">Add an Event</h1>
            <p>Create and share your event with the community - it only takes a minute!</p>
            <form className="add-event-form" onSubmit={(event) => handleSubmit(event)}>
                <section>
                    <label htmlFor="title">Event Title:</label>
                    <input 
                        onChange={(event) => handleEventDetailsUpdate(event)} 
                        type="text" 
                        id="title" 
                        name="title"
                        placeholder="Add an event title"
                        required>
                    </input>
                </section>

                <section>
                    <label htmlFor="event_overview">Event Overview:</label>
                    <textarea 
                        className="event-overview"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        id="event_overview" 
                        name="event_overview"
                        placeholder="Add an event overview"
                        required>
                    </textarea>
                </section>

                <section>
                    <label htmlFor="description">Event Description:</label>
                    <textarea 
                        className="event-description"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        id="description" 
                        name="description"
                        placeholder="Add an event description"
                        required>
                    </textarea>
                </section>

                <section className="form-event-tag">
                    <label className="form-subtitle" htmlFor="event-tag">Select an Event Tag:</label>
                    <ul className="add-event-tags">
                        {tags.map((tag) => {
                            return (
                                <li 
                                    className="add-event-single-tag"
                                    key={tag.tag_id}>
                                    <label htmlFor="event-tag">{tag.name}</label>
                                    <input
                                        onChange={(event) => setNewEventTag(event.target.value)}
                                        type="radio"
                                        id="event-tag"
                                        name="event-tag"
                                        value={tag.tag_id}
                                        required>
                                    </input>
                                </li>
                            )
                        })}
                    </ul>
                </section>

                <section>
                    <label htmlFor="start_time">Start Time:</label>
                    <input 
                        className="date-time-input"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="datetime-local" 
                        id="start_time" 
                        name="start_time"
                        required>
                    </input>
                </section>

                <section>
                    <label htmlFor="end_time">End Time:</label>
                    <input 
                        className="date-time-input"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="datetime-local" 
                        id="end_time" 
                        name="end_time"
                        required>
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="timezone">Timezone: </label>
                    <input 
                        className="date-time-input"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="text" 
                        id="timezone" 
                        name="timezone">
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="is_online">Is the Event Online?</label>
                    <input
                        className="narrow-input"
                        onChange={(event) => {
                            handleEventDetailsUpdate(event);
                            setIsOnline(!isOnline);
                            setIsVenueSelectDisabled(!isVenueSelectDisabled);
                        }}
                        type="checkbox"
                        id="is_online"
                        name="is_online"
                        defaultChecked={true}
                        value={!isOnline}>
                    </input>
                </section>

                <section className="add-event-venue">
                    <label 
                        htmlFor="venue_id"
                        className={handleVenueSelectClassName()}
                    >
                        Venue:</label>
                    <select 
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        id="venue_id" 
                        name="venue_id"
                        disabled={isVenueSelectDisabled}
                        className={handleVenueSelectClassName()}
                    >
                        <option disabled hidden selected>Select Venue</option>
                        {venues.map((venue) => {
                            return (
                                <option key={venue.venue_id} value={venue.venue_id}>{venue.venue_name}</option>
                            )
                        })}
                    </select>
                </section>

                <section id="single-line">
                    <label htmlFor="event_type">Event Type: </label>
                    <input 
                        className="date-time-input"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="text" 
                        id="event_type" 
                        name="event_type"
                        placeholder="Expo, Forum, Conference"
                        required>
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="capacity">Capacity: </label>
                    <input 
                        className="narrow-input"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="number" 
                        id="capacity" 
                        name="capacity"
                        required>
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="is_free">Is the Event Free?</label>
                    <input
                        className="narrow-input"
                        onChange={(event) => {
                            handleEventDetailsUpdate(event);
                            setIsFree(!isFree);
                            setIsTicketPriceDisabled(!isTicketPriceDisabled);
                        }}
                        type="checkbox"
                        id="is_free"
                        name="is_free"
                        value={!isFree}>
                    </input>
                </section>

                <section id="single-line" className={handleTicketPriceClassName()}>
                    <label htmlFor="price">Ticket Price:</label>
                    <input 
                        className="narrow-input"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="number" 
                        id="price" 
                        name="price"
                        placeholder="£"
                        disabled={isTicketPriceDisabled}>
                    </input>
                </section>

                <section>
                    <label htmlFor="event_image_url">Event Image: </label>
                    <input 
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="text" 
                        id="event_image_url" 
                        name="event_image_url">
                    </input>
                </section>

                <section id="add-event-submit-buttons">
                    <button 
                        className="draft-button"
                        onClick={(event) => handleEventDetailsUpdate(event)}
                        name="is_published"
                        value="false"
                        type="submit"
                    >Save Draft
                    </button>
                    <button 
                        className="post-button"
                        type="submit"
                    >Post Event</button>
                </section>
            </form>
        </section>
    )
}