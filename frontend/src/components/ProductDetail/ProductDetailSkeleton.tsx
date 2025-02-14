import styles from './ProductDetailSkeleton.module.css';

export const ProductDetailSkeleton = () => {
    return (
        <div className={styles.container}>
            {/* Hero Section Skeleton */}
            <div className={styles.heroSkeleton}>
                <div className={styles.imageSkeleton} />
                <div className={styles.contentSkeleton}>
                    <div className={styles.titleSkeleton} />
                    <div className={styles.descriptionSkeleton}>
                        <div className={styles.line} />
                        <div className={styles.line} />
                        <div className={styles.line} />
                    </div>
                    <div className={styles.priceSkeleton} />
                </div>
            </div>

            {/* Departures Section Skeleton */}
            <div className={styles.departuresSkeleton}>
                <div className={styles.departuresTitleSkeleton} />
                <div className={styles.departuresListSkeleton}>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className={styles.departureItemSkeleton}>
                            <div className={styles.dateSkeleton} />
                            <div className={styles.priceSkeleton} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};