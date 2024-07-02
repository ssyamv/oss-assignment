declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    HW_ACCESS_KEY: string;
    HW_SECRET_ACCESS_KEY: string;
    HW_SERVER: string;
    BUCKET_NAME: string;
    SIGNED_EXPIRES: string;
    JWT_SECRET_KEY: string;
    REDIS_PORT: number;
    REDIS_HOST: string;
    EMAIL_SMTP: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    EMAIL_NAME: string;
    EMAIL_REGISTER_SUBJECT: string;
  }
}
