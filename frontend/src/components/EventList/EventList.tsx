import React, { useEffect, useState } from "react";
import EventCard from "../EventCard/EventCard";

interface Event {
    id: number;
    title: string;
    description: string;
    startingAt: string;
    duration: string;
    invitationsSendingAt: string;
    registrationsClosingAt: string;
    createdAt: string;
    onDelete: (eventId: number) => void;
}
    
const EventList = () => {

    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function handleDeleteEvent(eventId: number) {
        try {
            const res = await fetch(`http://localhost:4000/api/dashboard/deleteEvent/${eventId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Server error: " + res.statusText);
            }

            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        } catch (err: any) {
            setError("Fehler beim Löschen des Events: " + err.message);
        }
    }

    async function handleEditEvent(formData: Event) {
        try {
            const res = await fetch(`http://localhost:4000/api/dashboard/editEvent/${formData.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                title: formData.title,
                description: formData.description,
                startingAt: formData.startingAt,
                duration: formData.duration,
                invitationsSendingAt: formData.invitationsSendingAt,
                registrationsClosingAt: formData.registrationsClosingAt,
                }),
            });

            if (!res.ok) {
                throw new Error("Server error: " + res.statusText);
            }
        } catch (err: any) {
            setError("Fehler beim Bearbeiten des Events: " + err.message);
        }
    }

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
                <EventCard onDelete={handleDeleteEvent} key={e.id} event={e} />
            ))}
        </div>
    );
};
export default EventList;
