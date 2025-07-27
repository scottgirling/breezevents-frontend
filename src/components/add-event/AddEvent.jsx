import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addEvent, addEventTag, fetchTags, fetchVenues } from "../../utils/api";
import { supabase } from "../../supabase/client";
import "./AddEvent.css";

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
    const [eventImage, setEventImage] = useState({});

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

        const fileExt = eventImage.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `admin-uploads/${fileName}`;

        supabase.storage.from("event-images").upload(filePath, eventImage)
        .then(() => {
            const { data: { publicUrl } } = supabase.storage.from("event-images").getPublicUrl(filePath);
            return publicUrl;
        })
        .then((publicUrl) => {
            addEvent({ ...eventDetails, event_image_url: publicUrl, slug: generatedslug })
        })
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
        <section className="xl:mx-40">
            <h1 className="text-[#317575] text-3xl font-medium mt-4 mb-1">Add an Event</h1>
            <p>Create and share your event with the community - it only takes a minute!</p>
            <form 
                className="add-event-form" 
                onSubmit={(event) => handleSubmit(event)}
            >
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
                        className="min-h-24 text-base xl:min-h-16"
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
                        className="min-h-48 text-base xl:min-h-32"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        id="description" 
                        name="description"
                        placeholder="Add an event description"
                        required>
                    </textarea>
                </section>

                <section className="form-event-tag">
                    <label 
                        className="xl:min-w-[12vw]"
                        htmlFor="event-tag"
                    >
                        Select an Event Tag:
                    </label>
                    <ul className="flex flex-wrap justify-around xl:justify-start">
                        {tags.map((tag) => {
                            return (
                                <li 
                                    className="my-1 mx-2"
                                    key={tag.tag_id}>
                                    <label htmlFor="event-tag">{tag.name}</label>
                                    <input
                                        className="max-w-max"
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
                        className="max-w-[60vw] xl:max-w-[20vw]"
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
                        className="max-w-[60vw] xl:max-w-[20vw]"
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
                        className="max-w-[60vw] xl:max-w-[20vw]"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="text" 
                        id="timezone" 
                        name="timezone">
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="is_online">Is the Event Online?</label>
                    <input
                        className="max-w-[20vw]"
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
                        className={handleVenueSelectClassName()}
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        id="venue_id" 
                        name="venue_id"
                        disabled={isVenueSelectDisabled}
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
                        className="max-w-[60vw] xl:max-w-[20vw]"
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
                        className="max-w-[20vw]"
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
                        className="max-w-[20vw]"
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
                        className="max-w-[20vw]"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="number" 
                        id="price" 
                        name="price"
                        placeholder="£"
                        disabled={isTicketPriceDisabled}>
                    </input>
                </section>

                <section>
                    <label>Event Image: </label>
                    <section id="image-file">
                        <label 
                            htmlFor="event_image_url" 
                            className="border-1 border-[#808080] p-1 rounded-md max-w-max cursor-pointer"
                        >
                            Choose file
                        </label>
                        <input 
                            onChange={(event) => setEventImage(event.target.files[0])}
                            type="file" 
                            accept="image/*"
                            id="event_image_url"
                            name="event_image_url">
                        </input>
                        <p className="my1 mx-2 min-w-fit text-left border-1 border-[#808080] rounded-md p-1">{eventImage.name ? eventImage.name : "No file chosen"}</p>
                    </section>
                </section>

                <section id="add-event-submit-buttons">
                    <button 
                        className="draft-btn xl:mx-4"
                        onClick={(event) => handleEventDetailsUpdate(event)}
                        name="is_published"
                        value="false"
                        type="submit"
                    >Save Draft
                    </button>
                    <button 
                        className="post-button xl:mx-4"
                        type="submit"
                    >Post Event</button>
                </section>
            </form>
        </section>
    )
}