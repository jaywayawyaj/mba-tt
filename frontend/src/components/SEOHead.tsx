import Head from 'next/head';

interface SEOHeadProps {
    title: string;
    indexable: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, indexable }) => {
    return (
        <Head>
            <meta name="robots" content={indexable ? "index, follow" : "noindex"} />
            <title>{title}</title>
        </Head>
    );
};