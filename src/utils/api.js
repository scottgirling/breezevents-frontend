import axios from "axios";

const eventsApi = axios.create({
    baseURL: "https://events-platform-be-1fmx.onrender.com/api/"
});

export const fetchTags = () => {
    return eventsApi.get("tags")
    .then((response) => {
        return response.data.tags;
    });
}

export const fetchEvents = (tag) => {
    return eventsApi.get("events", {
        params: {
            tag: tag
        }
    })
    .then((response) => {
        return response.data.events;
    });
}

export const fetchEventById = (event_id) => {
    return eventsApi.get(`events/${event_id}`)
    .then((response) => {
        return response.data.event;
    });
}

// export const fetchVenueById = (venue_id) => {
//     return eventsApi.get(`venues/${venue_id}`)
//     .then((response) => {
//         return response.data.venue;
//     });
// }

export const fetchHostById = (host_id) => {
    return eventsApi.get(`users/${host_id}`)
    .then((response) => {
        return response.data.user;
    })
}