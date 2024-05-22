declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    DATABASE_URL: string;
    HW_ACCESS_KEY: string;
    HW_SECRET_ACCESS_KEY: string;
    HW_SERVER: string;
    BUCKET_NAME: string;
    JWT_SECRET_KEY: string;
    REDIS_PORT: number;
    REDIS_HOST: string;
  }
}
