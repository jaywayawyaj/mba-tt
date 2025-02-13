declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_API_DOMAIN: string;
            NODE_ENV: 'development' | 'production' | 'test';
        }
    }
}

export {};