import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchAllEvents, fetchEvents, fetchTags } from "../../utils/api";
import "./EventList.css";

export const EventList = () => {
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [numberOfEvents, setNumberOfEvents] = useState(null);
    const [events, setEvents] = useState([]);
    const [activeEventTag, setActiveEventTag] = useState("View all");
    const [eventBatch, setEventBatch] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const eventTagQuery = searchParams.get("tag");
    const limitQuery = searchParams.get("limit");
    const sortByQuery = searchParams.get("sort_by");
    const orderQuery = searchParams.get("order");
    const isFreeQuery = searchParams.get("is_free");
    const isOnlineQuery = searchParams.get("is_online");

    const setEventTagQuery = (tag) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("tag", tag);
        setSearchParams(newParams);
    }

    const setLimit = (limit) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("limit", Number(limit));
        setSearchParams(newParams);
    }

    const setSortBy = (sort_by) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("sort_by", sort_by)
        setSearchParams(newParams);
    }
    
    const setOrder = (order) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("order", order)
        setSearchParams(newParams);
    }

    const setIsFree = (isFree) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("is_free", isFree);
        setSearchParams(newParams);
    }

    const setIsOnline = (isOnline) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("is_online", isOnline);
        setSearchParams(newParams);
    }

    useEffect(() => {
        setLoading(true);
        fetchTags()
        .then((returnedTags) => {
            setTags(returnedTags)
        })
        fetchAllEvents(eventTagQuery, isFreeQuery, isOnlineQuery)
        .then((returnedEvents) => {
            setNumberOfEvents(returnedEvents.length)
        })
        fetchEvents(eventTagQuery, isFreeQuery, isOnlineQuery, sortByQuery, orderQuery, limitQuery)
        .then((returnedEvents) => {
            setEvents(returnedEvents);
            setLoading(false);
        })
    }, [eventTagQuery, isFreeQuery, isOnlineQuery, sortByQuery, orderQuery, limitQuery]);

    const handleResetFilters = () => {
        window.history.replaceState(null, '', window.location.pathname);
        window.location.reload();
    }

    const handleLoadMoreButton = () => {
        let isDisabled = false;
        if (events.length >= numberOfEvents) {
            isDisabled = true;
        }
        return isDisabled;
    }
    
    return (
        <section className="event-list">
            <section className="discover-events">
                <ul className="tags-list">
                    <li className="tag-name">
                        <button 
                        className="btn btn-tag" 
                        onClick={() => {
                            setEventTagQuery("");
                            setActiveEventTag("View all");
                        }}
                        aria-label="View all events">
                            View all
                            {activeEventTag === "View all" && <p className="underline"></p>}
                        </button>
                    </li>
                    {tags.map((tag) => {
                        return (
                            <li className="tag-name" key={tag.tag_id}>
                                <button 
                                className="btn btn-tag" 
                                value={tag.slug} 
                                onClick={(event) => {
                                    setEventTagQuery(event.target.value);
                                    setActiveEventTag(tag.name);
                                }}
                                aria-label={`View ${tag.name} events`}>
                                    {tag.name}
                                    {tag.name === activeEventTag && <p className="underline"></p>}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <section>
                <section className="filter-events">
                    {isFreeQuery ? (
                        <button id="button-clicked" onClick={() => setIsFree("")}>Free</button>
                    ) : (
                        <button onClick={() => setIsFree(true)}>Free</button>

                    )}
                    {isOnlineQuery ? (
                        <button id="button-clicked" onClick={() => setIsOnline("")}>Online</button>
                    ) : (
                        <button onClick={() => setIsOnline(true)}>Online</button>
                    )}

                    <select onChange={(event) => setSortBy(event.target.value)}>
                        <option disabled selected hidden value="">Sort By</option>
                        <option value="start_time">Event Date</option>
                        <option value="price">Price</option>
                        <option value="created_at">Date Added</option>
                    </select>

                    <select onChange={(event) => setOrder(event.target.value)}>
                        <option disabled selected hidden value="">Order</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </section>

                <section className="top-picks-reset">
                    <section>
                        <h1 className="top-picks">Our Top Picks</h1>
                    </section>
                    <section className="reset-filters">
                        <button 
                        onClick={() => handleResetFilters()}
                        aria-label="Reset event filters">
                            <i className="fa-solid fa-arrows-rotate"></i>
                        </button>
                    </section>
                </section>

                {loading ? (
                    <p className="loading">Loading events...</p>
                ) : (
                    events.length ? (
                        <ul>
                        {events.map((event) => {
                            return (
                                <li className="event-card" key={event.event_id}>
                                    <section className="title-and-online">
                                        <h2 className="event-title">{event.title}</h2>
                                        {event.is_online && (
                                            <p className="online-event">ONLINE</p>
                                        )}
                                    </section>

                                    <section className="event-image-and-description">
                                        <section>
                                            <img 
                                            className="event-image-events-list" 
                                            src={event.event_img_url}
                                            alt={`${event.title} event poster`} />
                                        </section>
                                        <section className="event-description-and-date">
                                            <p className="event-overview">{event.event_overview}</p>
                                            <p className="event-date-events-list">{new Date(event.start_time).toDateString()}</p>
                                        </section>
                                    </section>
                                        <section className="event-price-date">
                                            {event.price !== 0 ? (
                                                <p className="ticket-price">£{event.price}</p>
                                            ) : (
                                                <p className="free-ticket">FREE</p>
                                            )}
                                            {(event.capacity - event.attendees_count) < 100 ? (
                                                <p className="limited-tickets">LIMITED TICKETS</p>
                                            ) : (
                                                <p></p>
                                            )}
                                            <Link to={`/events/${event.event_id}`}>
                                                <button 
                                                className="btn btn-white"
                                                aria-label={`Find tickets for ${event.title}`}>
                                                    Find Tickets
                                                </button>
                                            </Link>
                                        </section>
                                    </li>
                                )
                            })}
                            </ul>
                        ) : (
                            <p className="no-events-found">No events found. Please select another category.</p>
                    )
                )}
            </section>

            <section className="load-more">
                <p>Showing {events.length} of {numberOfEvents} events.</p>
                {handleLoadMoreButton() ? (
                    <button className="load-more-disabled">Load More</button>
                ) : (
                    <button disabled={handleLoadMoreButton()} onClick={() => {
                        if (eventBatch == 1) {
                            setLimit(20);
                            setEventBatch(eventBatch + 1);
                        } else {
                            setEventBatch(eventBatch + 1);
                            setLimit(10 * eventBatch);
                        }
                    }}>Load More</button>
                )}
            </section>
        </section>
    )
}