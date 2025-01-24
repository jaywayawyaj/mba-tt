import { Departure } from '../types/product';

export const isProductAvailable = (departures: Departure[]): boolean => {
    return departures.length > 0 && !departures.every(dep => dep.booked_pax === dep.max_pax);
};

export const sortDepartures = (departures: Departure[]): Departure[] => {
    return [...departures].sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA.getTime() - dateB.getTime();
    });
};