import Head from 'next/head';
import { addDays, format } from 'date-fns';
import styles from './[productId].module.css';
import Image from 'next/image';

interface Departure {
    id: number;
    start_date: string;
    price: number;
    booked_pax: number;
    max_pax: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    duration: number;
    departures: Departure[];
    location: string;
    difficulty: string;
}

interface ProductDetailProps {
    product: Product;
    departures: Departure[];
}

const isProductAvailable = (departures: Departure[]) => {
    return departures.length > 0 && !departures.every(dep => dep.booked_pax === dep.max_pax);
};

const SEOHead: React.FC<{ title: string; indexable: boolean }> = ({ title, indexable }) => {
    return (
        <Head>
            <meta name="robots" content={indexable ? "index, follow" : "noindex"} />
            <title>{title}</title>
        </Head>
    );
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product, departures }) => {
    if (!product) return <div>Loading...</div>;

    const available = isProductAvailable(departures);

    return (
        <div className={styles.container}>
            <SEOHead title={product.name} indexable={available} />
            <div className={styles.heroContainer}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <div className={styles.detailsContainer}>
                        <div className={styles.detailItem}>
                            <Image
                                src="/icons/map-marker.png"
                                alt="Location"
                                width={16}
                                height={16}
                                className={styles.detailIcon}
                            />
                            <span className={styles.detailText}>{product.location}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <Image
                                src="/icons/sleep.png"
                                alt="Duration"
                                width={16}
                                height={16}
                                className={styles.detailIcon}
                            />
                            <span className={styles.detailText}>{product.duration} Days</span>
                        </div>
                        <div className={styles.detailItem}>
                            <Image
                                src="/icons/elevation.png"
                                alt="Difficulty"
                                width={16}
                                height={16}
                                className={styles.detailIcon}
                            />
                            <span className={styles.detailText}>{product.difficulty}</span>
                        </div>
                    </div>
                    <p className={styles.description}>{product.description}</p>

                </div>
            </div>
            <div className={styles.departuresSection}>
                <h2 className={styles.departuresTitle}>Departures</h2>
                {departures.length > 0 ? (
                    <ul className={styles.departuresList}>
                        {departures.map((dep) => {
                            const startDate = new Date(dep.start_date);
                            let endDateFormatted = 'Invalid Date';

                            if (!isNaN(startDate.getTime())) {
                                const endDate = addDays(startDate, product.duration);
                                endDateFormatted = format(endDate, 'dd/MM/yyyy');
                            }

                            const startDateFormatted = !isNaN(startDate.getTime())
                                ? format(startDate, 'dd/MM/yyyy')
                                : 'Invalid Date';

                            return (
                                <li key={dep.id} className={styles.departureItem}>
                                    <p>Start Date: {startDateFormatted}</p>
                                    <p>End Date: {endDateFormatted}</p>
                                    <p>Price: ${dep.price}</p>
                                    <p>{dep.booked_pax === dep.max_pax ? 'Fully Booked' : 'Available'}</p>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className={`${styles.departuresList} ${styles.noDepartures}`}>
                        <div className={styles.departureItem}>
                            <p>No departures are currently scheduled for this trip.</p>
                            <p>Please check back later or contact us for more information.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export async function getStaticPaths() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/products/`);
        if (!res.ok) {
            console.error('Failed to fetch products:', res);
            throw new Error(`Failed to fetch products: ${res.statusText}`);
        }

        const data = await res.json();
        const products = data.results;

        const paths = products.map((product: Product) => ({
            params: { productId: product.id.toString() },
        }));

        return { paths, fallback: false };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { paths: [], fallback: false };
    }
}

export async function getStaticProps({ params }: { params: { productId: string } }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/products/${params.productId}/`);
        if (!res.ok) {
            throw new Error(`Failed to fetch product: ${res.statusText}`);
        }
        const product: Product = await res.json();

        const departures: Departure[] = [...product.departures].sort((a, b) => {
            const dateA = new Date(a.start_date);
            const dateB = new Date(b.start_date);
            return dateA.getTime() - dateB.getTime();
        });

        return {
            props: {
                product,
                departures,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return {
            notFound: true,
        };
    }
}

export default ProductDetail;
