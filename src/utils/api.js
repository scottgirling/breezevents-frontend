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

export const startCheckoutSession = (event, ticketQuantity) => {
    return eventsApi.post("/create-checkout-session", {
        event,
        ticketQuantity
    })
    .then((response) => {
        return window.location.href = response.data.url;
    });
}