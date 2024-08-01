import dotenv from 'dotenv'
dotenv.config()

const GOOGLE_USER_LOGIN = process.env.GOOGLE_USER_LOGIN
const GOOGLE_USER_PASSWORD = process.env.GOOGLE_USER_PASSWORD
const USER_SESSION_PATH = process.env.USER_SESSION_PATH || '../../user_data'
const REQUEST_QUEUE_NAME = process.env.REQUEST_QUEUE_NAME
const AMQP_SERVER = process.env.AMQP_SERVER

export { GOOGLE_USER_LOGIN, GOOGLE_USER_PASSWORD, USER_SESSION_PATH, REQUEST_QUEUE_NAME, AMQP_SERVER }
