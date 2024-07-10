import 'dotenv/config'
import { Redis } from "ioredis"

// Connect to Redis Cluster
const cluster = new Redis.Cluster([
    { host: "127.0.0.1",  port: 6379 }, 
    { host: "127.0.0.1",  port: 6380 },
    { host: "127.0.0.1",  port: 6381 }
    ], 
    {
      scaleReads: "slave",
      redisOptions: {
        username: process.env.AUTH_USER,
        password: process.env.AUTH_PASS,
        showFriendlyErrorStack: true
      }
    });

// Set keys with hash tags for user 123
await cluster.set("user:{123}:profile", "Profile data for user 123");
await cluster.set("user:{123}:settings", "Settings data for user 123");
await cluster.set("user:{123}:preferences", "Preferences data for user 123");

// Set keys with hash tags for user 456
await cluster.set("user:{456}:profile", "Profile data for user 456");
await cluster.set("user:{456}:settings", "Settings data for user 456");
await cluster.set("user:{456}:preferences", "Preferences data for user 456");

// Set keys with hash tags for user 789
await cluster.set("user:789:profile", "Profile data for user 789");
await cluster.set("user:789:settings", "Settings data for user 789");
await cluster.set("user:789:preferences", "Preferences data for user 789");

// Retrieve keys for user 123
console.log(await cluster.get("user:{123}:profile"))
console.log(await cluster.get("user:{123}:settings"))
console.log(await cluster.get("user:{123}:preferences"))

// Retrieve keys for user 456
console.log(await cluster.get("user:{456}:profile"))
console.log(await cluster.get("user:{456}:settings"))
console.log(await cluster.get("user:{456}:preferences"))

// Retrieve keys for user 789
console.log(await cluster.get("user:789:profile"))
console.log(await cluster.get("user:789:settings"))
console.log(await cluster.get("user:789}:preferences"))

await cluster.disconnect()

/*
   ioredis
   https://github.com/redis/ioredis/tree/main

   Redis cluster specification
   https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/
*/
