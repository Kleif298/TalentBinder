import React, { useEffect, useState } from "react";
import EventCard from "../EventCard/EventCard";

interface Event {
    id: number;
    title: string;
    description: string;
    startingAt: string;
    duration: string;
    invitations_sending_at: string;
    registrations_closing_at: string;
    created_at: string;
}
    
const EventList = () => {

    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchEventsData(): Promise<Event[]> {
        try {
        const res = await fetch("http://localhost:4000/api/dashboard/callEvents", {
            credentials: "include"
        });
    
        if (!res.ok) {
            throw new Error("Server error: " + res.statusText);
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.events)) {
            return data.events as Event[];
        } 
        else {
            console.log("Either calling events failed or no events are registered in db: " + data.message);
            return [];
        }
        } catch (err: any) {
        console.log("Calling events failed: " + err.message);
        throw new Error(err.message);
        }
    }

    useEffect (() => {
        async function loadEvents() {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchEventsData();
            setEvents(data);
        } catch (err: any) {
            setError("Fehler beim Laden der Eventdaten: " + err.message);
        } finally {
            setIsLoading(false);
        }
        }
        loadEvents();
    }, []);
    
    if (isLoading) {
        return <div className="grid-list-container">Lade Kandidaten...</div>;
    }

    if (error) {
        return <div className="grid-list-container" style={{ color: "red" }}>Fehler: {error}</div>;
    }

    if (events.length === 0) {
        return <div className="grid-list-container">Keine Events gefunden.</div>;
    }

    return (
        <div className="grid-list-container">
            {events.map((e) => (
                <EventCard key={e.id} event={e} />
            ))}
        </div>
    );
};
export default EventList;
