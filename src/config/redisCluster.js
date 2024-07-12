import 'dotenv/config'
import { Redis } from "ioredis"

  const redisCluster = new Redis.Cluster([
      { host: "127.0.0.1",  port: 6379 }, 
      { host: "127.0.0.1",  port: 6380 },
      { host: "127.0.0.1",  port: 6381 }
      ], 
      {
        // Using SSCAN with scaleReads: "slave" will give incorrent number of elements. 
        //scaleReads: "slave",
        redisOptions: {
          username: process.env.AUTH_USER,
          password: process.env.AUTH_PASS,
          showFriendlyErrorStack: true
        }
      });

export { redisCluster }

/*
   Node-Redis
   https://www.npmjs.com/package/redis
*/