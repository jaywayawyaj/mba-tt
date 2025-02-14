import {  ProductDetailProps } from '@/types/product';
import { SEOHead } from '@/components/SEOHead';
import { isProductAvailable, sortDepartures } from '@/utils/product';
import styles from './[productId].module.css';
import { ProductHero } from '@/components/ProductDetail/ProductHero';
import { DepartureListItem } from '@/components/ProductDetail/DepartureListItem';
import { productService } from '@/services/productService';
import { ProductDetailSkeleton } from '@/components/ProductDetail/ProductDetailSkeleton';
import { useRouter } from 'next/router';
import { API_CONFIG } from '@/config/api';

const ProductDetail: React.FC<ProductDetailProps> = ({ product, departures }) => {
    const router = useRouter();

    if (router.isFallback) {
        return <ProductDetailSkeleton />;
    }

    const available = isProductAvailable(departures);

    return (
        <div className={styles.container}>
            <SEOHead title={product.name} indexable={available} />
            <ProductHero product={product} />
            <div className={styles.departuresSection}>
                <h2 className={styles.departuresTitle}>Departures</h2>
                {departures.length > 0 ? (
                    <ul className={styles.departuresList}>
                        {departures.map((dep) => (
                            <DepartureListItem
                                key={dep.id}
                                departure={dep}
                                duration={product.duration}
                            />
                        ))}
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
        const products = await productService.getAllProducts();

        const paths = products.map((product) => ({
            params: { productId: product.id.toString() },
        }));

        return {
            paths,
            fallback: true
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return { paths: [], fallback: true };
    }
}

export async function getStaticProps({ params }: { params: { productId: string } }) {
    try {
        const product = await productService.getProductById(params.productId);

        if (!product) {
            return { notFound: true };
        }

        const departures = sortDepartures(product.departures);

        return {
            props: {
                product,
                departures,
            },
            revalidate: API_CONFIG.REVALIDATION.PRODUCT_DETAIL,
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

export default ProductDetail;
