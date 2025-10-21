import "~/components/EventCard/EventCard.scss";

interface Event {
    id: number;
    title: string;
    description: string;
    startingAt: string;
    duration: string;
    invitationsSendingAt: string; 
    registrationsClosingAt: string; 
    createdAt: string;
}

interface EventCardProps {
    event: Event;
    onDelete: (eventId: number) => void;
}
const EventCard = ({ event, onDelete }: EventCardProps) => {
    return (
        <div className="event-card">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p><strong>Start:</strong> {new Date(event.startingAt).toLocaleString()}</p>
            <p><strong>Dauer:</strong> {String(event.duration)}</p>
            <p><strong>Einladungen gesendet am:</strong> {new Date(event.invitationsSendingAt).toLocaleDateString()}</p>
            <p><strong>Anmeldeschluss:</strong> {new Date(event.registrationsClosingAt).toLocaleDateString()}</p>
            <p><em>Erstellt am: {new Date(event.createdAt).toLocaleDateString()}</em></p>
            <div className="button-group">
                <button className="edit-button">Bearbeiten</button>
                <button onClick={() => onDelete(event.id)} className="delete-button">Löschen</button>
            </div>
        </div>
    );
}

export default EventCard;