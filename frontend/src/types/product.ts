export interface Departure {
    id: number;
    start_date: string;
    price: number;
    booked_pax: number;
    max_pax: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    duration: number;
    departures: Departure[];
    location: string;
    difficulty: string;
}

export interface ProductDetailProps {
    product: Product;
    departures: Departure[];
}