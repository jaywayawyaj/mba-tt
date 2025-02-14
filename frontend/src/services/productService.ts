import { Product } from '@/types/product';
import { APIErrorResponse } from '@/types/api';
import { API_CONFIG } from '@/config/api';

if (!API_CONFIG.BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_DOMAIN environment variable is not defined');
}

export class APIError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'APIError';
    }
}

async function handleAPIResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        if (response.status === 404) {
            return null as T;
        }
        const errorData = await response.json() as APIErrorResponse;
        throw new APIError(
            response.status,
            errorData.message || 'An error occurred'
        );
    }

    const data = await response.json();
    if (!data) {
        throw new APIError(500, 'Empty response received');
    }

    return data;
}

export const productService = {
    async getAllProducts(): Promise<Product[]> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
        const products = await handleAPIResponse<Product[]>(response);
        return products || [];
    },

    async getProductById(productId: string): Promise<Product | null> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCT_DETAIL(productId)}`
        );
        return handleAPIResponse<Product>(response);
    }
};