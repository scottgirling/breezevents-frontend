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
    })
}