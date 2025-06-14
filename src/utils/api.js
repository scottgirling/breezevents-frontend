import axios from "axios";

const eventsApi = axios.create({
    baseURL: "https://events-platform-be-1fmx.onrender.com/api"
});

export const fetchTags = () => {
    return eventsApi.get("/tags")
    .then((response) => {
        return response.data.tags;
    });
}

export const fetchEvents = (tag, isFree, isOnline, sortBy, order, limit) => {
    return eventsApi.get("/events", {
        params: {
            tag: tag,
            is_free: isFree,
            is_online: isOnline,
            sort_by: sortBy,
            order: order,
            limit: limit || 10
        }
    })
    .then((response) => {
        return response.data.events;
    });
}

export const fetchAllEvents = (eventTag, isFree, isOnline) => {
    return eventsApi.get("/events", {
        params: {
            tag: eventTag,
            is_free: isFree,
            is_online: isOnline,
            limit: 5000
        }
    })
    .then((response) => {
        return response.data.events;
    });
}

export const fetchEventById = (event_id) => {
    return eventsApi.get(`/events/${event_id}`)
    .then((response) => {
        return response.data.event;
    });
}

export const fetchUserById = (user_id) => {
    return eventsApi.get(`/users/${user_id}`)
    .then((response) => {
        return response.data.user;
    });
}

export const fetchEventsByUserId = (user_id) => {
    return eventsApi.get(`/users/${user_id}/events`)
    .then((response) => {
        return response.data.events;
    });
}

export const fetchEventsByHostId = (user_id) => {
    return eventsApi.get(`/events/host/${user_id}`)
    .then((response) => {
        return response.data.events;
    });
}

export const fetchVenues = () => {
    return eventsApi.get("/venues")
    .then((response) => {
        return response.data.venues;
    });
}

export const startCheckoutSession = (event, ticketQuantity, user_id) => {
    return eventsApi.post("/create-checkout-session", {
        event,
        ticketQuantity,
        user_id
    })
    .then((response) => {
        return window.location.href = response.data.url;
    });
}

export const fetchSessionData = (sessionId) => {
    return eventsApi.get(`/retrieve-session?session_id=${sessionId}`)
    .then((response) => {
        return response.data;
    });
}

export const updateEvent = (event_id, eventDetails) => {
    return eventsApi.patch(`/events/update/${event_id}`, eventDetails)
    .then((response) => {
        return response.data.event;
    });
}

export const updateUser = (user_id, userDetails) => {
    return eventsApi.patch(`/users/${user_id}`, userDetails)
    .then((response) => {
        return response.data.user;
    });
}

export const addEvent = (eventDetails) => {
    return eventsApi.post("/events", eventDetails)
    .then((response) => {
        return response.data.event;
    });
}

export const addEventTag = (eventTagDetails) => {
    return eventsApi.post("/event_tags", eventTagDetails)
    .then((response) => {
        return response.data.eventTag;
    });
}

export const addUser = (userDetails) => {
    return eventsApi.post("/users", userDetails)
    .then((response) => {
        return response.data.user;
    });
}

export const deleteEvent = (event_id) => {
    return eventsApi.delete(`/events/${event_id}`)
    .then((response) => {
        return response.data.event;
    });
}