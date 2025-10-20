import Header from "~/components/Header/Header.tsx";
import EventList from "~/components/EventList/EventList.tsx";
import EventModal from "~/components/EventModal/EventModal.tsx";

const EventDashboard = () => {
    return (
        <div>
            <Header />
            <EventModal />
            <EventList />
        </div>
    );
};

export default EventDashboard;
