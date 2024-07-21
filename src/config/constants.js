import dotenv from 'dotenv';
dotenv.config()

const GOOGLE_USER_LOGIN = process.env.GOOGLE_USER_LOGIN;
const GOOGLE_USER_PASSWORD = process.env.GOOGLE_USER_PASSWORD;
const USER_SESSION_PATH = "../../user_data" || process.env.USER_SESSION_PATH

export {
    GOOGLE_USER_LOGIN,
    GOOGLE_USER_PASSWORD,
    USER_SESSION_PATH
}