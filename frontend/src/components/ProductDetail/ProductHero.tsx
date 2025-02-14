import { Product } from "@/types/product";
import styles from './ProductHero.module.css';
import { DetailItem } from "./DetailItem";

interface ProductHeroProps {
    product: Product;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ product }) => (
    <div className={styles.heroContainer} role="banner">
        <div className={styles.heroContent}>
            <h1 className={styles.title} tabIndex={0}>{product.name}</h1>
            <dl className={styles.detailsContainer}>
                <DetailItem
                    label="Location"
                    value={product.location}
                    iconSrc="/icons/map-marker.png"
                />
                <DetailItem
                    label="Duration"
                    value={`${product.duration} Days`}
                    iconSrc="/icons/sleep.png"
                />
                <DetailItem
                    label="Difficulty"
                    value={product.difficulty}
                    iconSrc="/icons/elevation.png"
                />
            </dl>
            <p className={styles.description} tabIndex={0}>{product.description}</p>
        </div>
    </div>
);