import 'dotenv/config'
import { Redis } from 'ioredis'

const redisClient = new Redis({
    port: 7000, // Redis port
    host: "127.0.0.1", // Redis host
  });

export { redisClient }

/*
   Node-Redis
   https://www.npmjs.com/package/redis
*/