import Header from "~/components/Header/Header.tsx";
import EventList from "~/components/EventList/EventList.tsx";
import EventModal from "~/components/EventModal/EventModal.tsx";

import "./EventDashboard.scss";

const EventDashboard = () => {
    return (
        <div className="event-dashboard-page">
            <Header />
            <EventModal />
            <EventList />
        </div>
    );
};

export default EventDashboard;
