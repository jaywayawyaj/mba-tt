export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_DOMAIN,
    ENDPOINTS: {
        PRODUCTS: '/products',
        PRODUCT_DETAIL: (id: string) => `/products/${id}`,
    },
    REVALIDATION: {
        PRODUCT_DETAIL: 60,
        PRODUCTS_LIST: 300,
    }
} as const;