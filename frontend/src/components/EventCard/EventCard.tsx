import "~/components/EventCard/EventCard.scss";

interface EventCardProps {
    title: string;
    description: string;
    startingAt: string;
    duration: string;
    invitations_sending_at: string;
    registrations_closing_at: string;
    created_at: string;
}