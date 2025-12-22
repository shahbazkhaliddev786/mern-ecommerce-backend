import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

console.log(process.env);

export default {
    ENV: process.env.ENV || 'development',
    PORT: process.env.PORT || 4000,
    SERVER_URL: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`,
    DATABASE_URL: process.env.DATABASE_URL || '',
}