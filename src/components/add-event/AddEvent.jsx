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
    const [isFree, setIsFree] = useState(true);
    const [eventDetails, setEventDetails] = useState({
        title: null,
        event_overview: null,
        description: null,
        start_time: null,
        end_time: null,
        timezone: null, 
        venue_id: null,
        is_online: false,
        host_id: user_id,
        event_type: null,
        capacity: null,
        is_free: false,
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
            setVenues(returnedVenues)
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
            if (event.target.name === "is_free") {
                setEventDetails({ ...eventDetails, [key]: event.target.value, price: 0 });
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

    if (loading) {
        return (
            <p className="loading">Loading...</p>
        )
    }

    return (
        <section>
            <h1 className="add-event-title">Add an Event</h1>
            <p>Create and share your event with the community - it only takes a minute!</p>
            <form className="add-event-form" onSubmit={(event) => handleSubmit(event)}>
                <section>
                    <label htmlFor="title">Event Title:</label>
                    <input 
                        onBlur={(event) => handleEventDetailsUpdate(event)} 
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
                        onBlur={(event) => handleEventDetailsUpdate(event)}
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
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        id="description" 
                        name="description"
                        placeholder="Add an event description"
                        required>
                    </textarea>
                </section>

                <section>
                    <label htmlFor="event-tag">Select an Event Tag:</label>
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
                        onBlur={(event) => handleEventDetailsUpdate(event)}
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
                        onBlur={(event) => handleEventDetailsUpdate(event)}
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
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="checkbox"
                        id="is_online"
                        name="is_online"
                        value="true">
                    </input>
                </section>

                <section className="add-event-venue">
                    <label htmlFor="venue_id">Venue:</label>
                    <select 
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        id="venue_id" 
                        name="venue_id"
                        required
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
                        onBlur={(event) => handleEventDetailsUpdate(event)}
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
                        onBlur={(event) => handleEventDetailsUpdate(event)}
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
                        }}
                        type="checkbox"
                        id="is_free"
                        name="is_free"
                        value={isFree}>
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="price">Ticket Price:</label>
                    <input 
                        className="narrow-input"
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="number" 
                        id="price" 
                        name="price"
                        placeholder="£"
                        disabled={!isFree}>
                    </input>
                </section>

                <section>
                    <label htmlFor="event_image_url">Event Image: </label>
                    <input 
                        onBlur={(event) => handleEventDetailsUpdate(event)}
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

// module.exports = handleEventDetailsUpdate;