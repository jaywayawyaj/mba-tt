import { Product } from './product';

export interface APIResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface ProductsAPIResponse extends APIResponse<{
    results: Product[];
}> {}

export interface ProductAPIResponse extends APIResponse<Product> {}

export interface APIErrorResponse {
    message: string;
    status: number;
    code?: string;
}