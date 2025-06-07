export const AddEvent = () => {
    return (
        <section>
            <form>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title"></input>

                <label htmlFor="event_overview">Event Overview</label>
                <input type="text" id="event_overview" name="event_overview"></input>

                <label htmlFor="description">Event Description</label>
                <input type="text" id="description" name="description"></input>

                <label htmlFor="start_time">Start time</label>
                <input type="datetime-local" id="start_time" name="start_time"></input>

                <label htmlFor="end_time">End time</label>
                <input type="datetime-local" id="end_time" name="end_time"></input>

                <label htmlFor="timezone">Timezone</label>
                <input type="text" id="timezone" name="timezone">
                </input>

                <label htmlFor="venue_id">Venue</label>
                {/* drop down box of venues! */}

                <label htmlFor="is_online">Is the Event Online?</label>
                {/* checkbox */}

                <label htmlFor="event_type">Event Type</label>
                <input type="text" id="event_type" name="event_type"></input>

                <label htmlFor="capacity">Capacity</label>
                <input type="text" id="capacity" name="capacity"></input>

                <label htmlFor="is_free">Is the Event Free?</label>
                {/* checkbox */}

                <label htmlFor="price">Ticket price</label>
                <input type="text" id="price" name="price"></input>

                <label htmlFor="event_image_url">Event Image</label>
                <input type="text" id="event_image_url" name="event_image_url"></input>

                {/* buttons to determine is published or draft event -> also need to display draft events in host's profile! */}

                {/* <input type="submit"></input> */}
            </form>
        </section>
    )
}