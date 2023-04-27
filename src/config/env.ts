import { config } from 'dotenv';

// Load the environment variables from the .env file
const result = config();

if (result.error) {
  throw result.error;
}

// Export the environment variables
export const {
  APPLICATION_PORT,
  MONGO_HOST,
  MONGO_PASSWORD,
  MONGO_USER,
  MONGO_PORT,
  MONGO_DATABASE,
  DEBUG,
  URL_CLIENT,
  TOKEN_EXPIRATION_IN_MIN
} = process.env;