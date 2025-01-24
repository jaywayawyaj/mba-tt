import Head from 'next/head';
import { addDays, format } from 'date-fns';
import styles from './[productId].module.css';

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
                <h1 className={styles.title}>{product.name}</h1>
                <p className={styles.description}>{product.description}</p>
            </div>
            <div className={styles.departuresSection}>
                <h2 className={styles.departuresTitle}>Departures</h2>
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

        const departures: Departure[] = product.departures || [];

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
