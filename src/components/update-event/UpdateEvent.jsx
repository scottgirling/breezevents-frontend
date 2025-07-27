import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventById, fetchVenues, updateEvent } from "../../utils/api";
import { supabase } from "../../supabase/client";

export const UpdateEvent = () => {
    const navigate = useNavigate();
    const { event_id, user_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [venues, setVenues] = useState([]);
    const [isFree, setIsFree] = useState(true);
    const [eventDetails, setEventDetails] = useState({});
    const [eventImage, setEventImage] = useState({});

    useEffect(() => {
        setLoading(true);
        fetchEventById(event_id)
        .then((returnedEvent) => {
            setEventDetails({
                title: returnedEvent.title,
                event_overview: returnedEvent.event_overview,
                description: returnedEvent.description,
                start_time: returnedEvent.start_time,
                end_time: returnedEvent.end_time,
                timezone: returnedEvent.timzone,
                venue_id: returnedEvent.venue_id,
                is_online: returnedEvent.is_online,
                event_type: returnedEvent.event_type,
                capacity: returnedEvent.capacity,
                is_free: returnedEvent.is_free,
                price: returnedEvent.price,
                event_image_url: returnedEvent.event_image_url,
                is_published: returnedEvent.is_published
            });
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

        const fileName = eventDetails.event_image_url.split("/").reverse()[0];
        const filePath = `admin-uploads/${fileName}`;

        supabase.storage.from("event-images").upload(filePath, eventImage, {
            upsert: true
        })
        .then(() => {
            updateEvent(event_id, eventDetails)
        })
        .then(() => {
            navigate(`/breezer/${user_id}`);
        });
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
        });
        return updatedEventDetails;
    }

    const handleEventImageText = () => {
        if (eventImage.name) {
            return eventImage.name;
        }
        return eventDetails.event_image_url ? "File uploaded" : "No file chosen";
    }

    if (loading) {
        return (
            <p>Loading event...</p>
        );
    }

    return (
        <section className="xl:mx-40">
            <h1 className="text-[#317575] text-3xl font-medium mt-4 mb-1">Update an Event</h1>
            <p>Keep your attendees excited and informed - take a moment to update your event with the latest details!</p>
            <form className="add-event-form" onSubmit={(event) => handleSubmit(event)}>
                <section>
                    <label htmlFor="title">Event Title:</label>
                    <input
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={eventDetails.title}>
                    </input>
                </section>

                <section>
                    <label htmlFor="event_overview">Event Overview:</label>
                    <textarea
                        className="min-h-24 text-base xl:min-h-16"
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        id="event_overview"
                        name="event_overview"
                        defaultValue={eventDetails.event_overview}>
                    </textarea>
                </section>

                <section>
                    <label htmlFor="description">Event Description:</label>
                    <textarea 
                        className="min-h-48 text-base xl:min-h-32"
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        id="description" 
                        name="description"
                        defaultValue={eventDetails.description}>
                    </textarea>
                </section>

                <section>
                    <label htmlFor="start_time">Start Time:</label>
                    <input 
                        className="max-w-[60vw] xl:max-w-[20vw]"
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="datetime-local" 
                        id="start_time" 
                        name="start_time"
                        defaultValue={eventDetails.start_time}>
                    </input>
                </section>

                <section>
                    <label htmlFor="end_time">End Time:</label>
                    <input 
                        className="max-w-[60vw] xl:max-w-[20vw]"
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="datetime-local" 
                        id="end_time" 
                        name="end_time"
                        defaultValue={eventDetails.end_time}>
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="timezone">Timezone: </label>
                    <input 
                        className="max-w-[60vw] xl:max-w-[20vw]"
                        onChange={(event) => handleEventDetailsUpdate(event)}
                        type="text" 
                        id="timezone" 
                        name="timezone"
                        defaultValue={eventDetails.timezone}>
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="is_online">Is the Event Online?</label>
                    <input
                        className="max-w-[20vw]"
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="checkbox"
                        id="is_online"
                        name="is_online"
                        defaultValue={eventDetails.is_online}>
                    </input>
                </section>

                <section className="add-event-venue">
                    <label htmlFor="venue_id">Venue:</label>
                    <select 
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        id="venue_id" 
                        name="venue_id"
                        defaultValue={eventDetails.venue_id}
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
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="text" 
                        id="event_type" 
                        name="event_type"
                        defaultValue={eventDetails.event_type}>
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="capacity">Capacity: </label>
                    <input 
                        className="max-w-[20vw]"
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="number" 
                        id="capacity" 
                        name="capacity"
                        defaultValue={eventDetails.capacity}>
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="is_free">Is the Event Free?</label>
                    <input
                        className="max-w-[20vw]"
                        onChange={(event) => {
                            handleEventDetailsUpdate(event);
                            setIsFree(!isFree);
                        }}
                        type="checkbox"
                        id="is_free"
                        name="is_free"
                        defaultValue={isFree}
                    >
                    </input>
                </section>

                <section id="single-line">
                    <label htmlFor="price">Ticket Price: £</label>
                    <input 
                        className="max-w-[20vw]"
                        onBlur={(event) => handleEventDetailsUpdate(event)}
                        type="number" 
                        id="price" 
                        name="price"
                        defaultValue={eventDetails.price}
                        disabled={!isFree}>
                    </input>
                </section>

                <section>
                    <label>Event Image: </label>
                    <section className="image-file">
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
                            name="event_image_url"
                            >
                        </input>
                        <p className="my1 mx-2 min-w-fit text-left border-1 border-[#808080] rounded-md p-1">{handleEventImageText()}</p>
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
                        onClick={(event) => handleEventDetailsUpdate(event)}
                        name="is_published"
                        value="true"
                        type="submit"
                    >Post Event</button>
                </section>
            </form>
        </section>
    )
}