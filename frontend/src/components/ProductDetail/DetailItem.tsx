import styles from './DetailItem.module.css';
import Image from 'next/image';

interface DetailItemProps {
    label: string;
    value: string;
    iconSrc: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({ label, value, iconSrc }) => (
    <div className={styles.detailItem}>
        <dt className="visually-hidden">{label}</dt>
        <dd className={styles.detailText}>
            <Image
                src={iconSrc}
                alt=""
                width={16}
                height={16}
                className={styles.detailIcon}
                aria-hidden="true"
            />
            <span>{value}</span>
        </dd>
    </div>
);