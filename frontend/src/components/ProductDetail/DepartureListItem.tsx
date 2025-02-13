import { Departure } from "@/types/product";
import { addDays, format } from "date-fns";
import styles from './DepartureListItem.module.css';

const formatDate = (date: string): string => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime())
        ? format(parsedDate, 'dd/MM/yyyy')
        : 'Invalid Date';
};

interface DepartureListItemProps {
    departure: Departure;
    duration: number;
}

export const DepartureListItem: React.FC<DepartureListItemProps> = ({ departure, duration }) => {
    const startDate = formatDate(departure.start_date);
    const endDate = !startDate.includes('Invalid')
        ? formatDate(addDays(new Date(departure.start_date), duration).toISOString())
        : 'Invalid Date';

    const isFullyBooked = departure.booked_pax === departure.max_pax;
    const availabilityStatus = isFullyBooked ? 'Fully Booked' : `Available (${departure.max_pax - departure.booked_pax} spots left)`;
    const availabilityClass = isFullyBooked ? styles.fullyBooked : styles.available;

    return (
        <li className={styles.departureItem}>
            <div role="group" aria-label="Departure Details">
                <p><strong>Start Date:</strong> {startDate}</p>
                <p><strong>End Date:</strong> {endDate}</p>
                <p><strong>Price:</strong> ${departure.price.toLocaleString()}</p>
                <p
                    className={availabilityClass}
                    role="status"
                    aria-live="polite"
                >
                    {availabilityStatus}
                </p>
            </div>
        </li>
    );
};