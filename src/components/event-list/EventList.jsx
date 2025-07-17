import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchAllEvents, fetchEvents, fetchTags } from "../../utils/api";
import "./EventList.css";

export const EventList = () => {
    const [loadingTags, setLoadingTags] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);
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
        setLoadingTags(true);
        setLoadingEvents(true);
        fetchTags()
        .then((returnedTags) => {
            setTags(returnedTags);
            setLoadingTags(false);
        })
        fetchAllEvents(eventTagQuery, isFreeQuery, isOnlineQuery)
        .then((returnedEvents) => {
            setNumberOfEvents(returnedEvents.length)
        })
        fetchEvents(eventTagQuery, isFreeQuery, isOnlineQuery, sortByQuery, orderQuery, limitQuery)
        .then((returnedEvents) => {
            let updatedEvents = [];
            returnedEvents.map((event) => {
                const imgFileName = event.event_image_url.split("/")[9];
                return updatedEvents.push({ ...event, event_image_url: imgFileName });
            })
            setEvents(updatedEvents);
            setLoadingEvents(false);
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
        <section className="min-h-[70vh] xl:mx-12">
            <section className="xl:max-w-[80vw] m-auto">
                <ul className="mt-2 flex flex-wrap bg-[#FFB593] rounded-md p-1 lg:my-4 mx-auto max-w-[80rem]">
                    {loadingTags ? (
                        <li className="p-1 text-xs xl:mx-2">
                            <button className="btn btn-tag">
                                Loading tags...
                            </button>
                        </li>
                    ) : (
                        <>
                            <li className="p-1 text-xs xl:mx-2">
                                <button 
                                    className="btn btn-tag" 
                                    onClick={() => {
                                        setEventTagQuery("");
                                        setActiveEventTag("View all");
                                    }}
                                    aria-label="View all events"
                                >
                                    View all
                                    {activeEventTag === "View all" && <p className="border-t-1"></p>}
                                </button>
                            </li>
                            {tags.map((tag) => {
                                return (
                                    <li 
                                        className="p-1 text-xs xl:mx-2"
                                        key={tag.tag_id}>
                                        <button 
                                            className="btn btn-tag" 
                                            value={tag.slug} 
                                            onClick={(event) => {
                                                setEventTagQuery(event.target.value);
                                                setActiveEventTag(tag.name);
                                            }}
                                            aria-label={`View ${tag.name} events`}
                                        >
                                            {tag.name}
                                            {tag.name === activeEventTag && <p className="border-t-1"></p>}
                                        </button>
                                    </li>
                                )
                            })}
                        </>
                    ) }
                </ul>
            </section>

            <section>
                <section className="flex flex-wrap justify-around my-4 mx-auto xl:max-w-[80vw] xl:block">
                    {isFreeQuery ? (
                        <button 
                            className="filter-btn"
                            id="button-clicked" 
                            onClick={() => setIsFree("")}
                        >
                            Free
                        </button>
                    ) : (
                        <button 
                            className="filter-btn"
                            onClick={() => setIsFree(true)}
                        >
                            Free
                        </button>

                    )}
                    {isOnlineQuery ? (
                        <button 
                            className="filter-btn"
                            id="button-clicked" 
                            onClick={() => setIsOnline("")}
                        >
                            Online
                        </button>
                    ) : (
                        <button 
                            className="filter-btn"
                            onClick={() => setIsOnline(true)}
                        >
                            Online
                        </button>
                    )}

                    <select 
                        className="filter-btn"
                        onChange={(event) => setSortBy(event.target.value)}
                    >
                        <option disabled selected hidden value="">Sort By</option>
                        <option value="start_time">Event Date</option>
                        <option value="price">Price</option>
                        <option value="created_at">Date Added</option>
                    </select>

                    <select 
                        className="filter-btn"
                        onChange={(event) => setOrder(event.target.value)}
                    >
                        <option disabled selected hidden value="">Order</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </section>

                <section className="flex items-center justify-between xl:mx-auto xl:max-w-[90rem]">
                    <section>
                        <h1 className="my-4 pl-4 font-bold xl:text-3xl">Our Top Picks</h1>
                    </section>
                    <section>
                        <button 
                            className="bg-inherit"
                            onClick={() => handleResetFilters()}
                            aria-label="Reset event filters">
                                <i className="fa-solid fa-arrows-rotate xl:text-xl"></i>
                        </button>
                    </section>
                </section>

                {loadingEvents ? (
                    <p className="loading">Loading events...</p>
                ) : (
                    events.length ? (
                        <ul className="xl:flex xl:flex-wrap xl:max-w-[80vw] xl:mx-auto xl:justify-center" >
                        {events.map((event) => {
                            return (
                                <li 
                                    className="bg-[#317575] text-white text-left p-2 rounded-md mt-3 mx-0 sm:p-4 xl:max-w-[25vw] lg:m-2 xl:flex xl:flex-col xl:justify-between"
                                    key={event.event_id}>
                                    <section>
                                        <section className="flex justify-between m-1">
                                            <h2 className="font-semibold sm:text-xl">{event.title}</h2>
                                            {event.is_online && (
                                                <p className="bg-[#90ee90] h-max text-xs text-black rounded-md py-1 px-2 xl:text-sm">ONLINE</p>
                                            )}
                                        </section>

                                        <section className="flex md:my-4 xl:block">
                                            <section className="m-auto flex items-center max-h-[20vh]">
                                                <img 
                                                    className="rounded-md max-h-[15vh] xl: w-auto xl:max-h-[25vh] xl:m-auto"
                                                    src={`https://ik.imagekit.io/scott/${event.event_image_url}?tr=f-auto`}
                                                    alt={`${event.title} event poster`} 
                                                />
                                            </section>
                                            <section className="flex flex-col justify-around max-h-[20vh] min-w-[50%] max-w-[50%] m-2 xl:min-w-fit">
                                                <p className="mt-1 text-xs sm:text-base lg:text-xl">{event.event_overview}</p>
                                                <p className="text-xs font-semibold my-2 md:text-base">{new Date(event.start_time).toDateString()}</p>
                                            </section>
                                        </section>
                                    </section>
                                    <section>
                                        <section className="m-1 flex justify-around items-center text-xs sm:text-base lg:flex lg:flex-wrap">
                                            {event.price !== 0 ? (
                                                <p className="ticket-price xl:m-1">£{event.price}</p>
                                            ) : (
                                                <p className="bg-[#FFB593] text-black rounded-md py-1 px-3 xl:m-1">FREE</p>
                                            )}
                                            {(event.attendees_count >= event.capacity) ? (
                                                <p className="bg-[#FFB593] text-black rounded-md py-1 px-3 xl:m-1">SOLD OUT</p>
                                            ) : (event.capacity - event.attendees_count) < 100 ? (
                                                <p className="bg-[#FFB593] text-black rounded-md py-1 px-3 xl:m-1">LIMITED TICKETS</p>
                                            ) : (
                                                <p></p>
                                            )}
                                            <Link to={`/events/${event.event_id}`}>
                                                <button 
                                                    className="btn btn-white xl:m-1"
                                                    aria-label={`Find tickets for ${event.title}`}
                                                >
                                                    {(event.attendees_count >= event.capacity) ? (
                                                        <p>View Event</p>
                                                    ) : (
                                                        <p>Find Tickets</p>
                                                    )}
                                                </button>
                                            </Link>
                                        </section>
                                    </section>
                                </li>
                                )
                            })}
                            </ul>
                        ) : (
                            <p className="my-4 text-xs lg:text-base xl:text-xl">No events found. Please select another category.</p>
                    )
                )}
            </section>

            <section className="bg-white my-4 mx-auto rounded-md w-max py-2 px-8 text-xs xl:text-base xl:my-8">
                <p>Showing {events.length} of {numberOfEvents} events.</p>
                {handleLoadMoreButton() ? (
                    <button 
                        className="load-more-btn"
                        disabled={true}
                        id="opacity-50"
                    >
                        Load More
                    </button>
                ) : (
                    <button 
                        className="load-more-btn"
                        disabled={handleLoadMoreButton()} 
                        onClick={() => {
                            if (eventBatch == 1) {
                                setLimit(20);
                                setEventBatch(eventBatch + 1);
                            } else {
                                setEventBatch(eventBatch + 1);
                                setLimit(10 * eventBatch);
                            }
                        }}
                    >
                        Load More
                    </button>
                )}
            </section>
        </section>
    )
}