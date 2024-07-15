import 'dotenv/config'
import { redisCluster } from "../src/config/redisCluster.js"

// Set keys with hash tags for user 123
await redisCluster.set("user:{123}:profile", "Profile data for user 123");
await redisCluster.set("user:{123}:settings", "Settings data for user 123");
await redisCluster.set("user:{123}:preferences", "Preferences data for user 123");

// Set keys with hash tags for user 456
await redisCluster.set("user:{456}:profile", "Profile data for user 456");
await redisCluster.set("user:{456}:settings", "Settings data for user 456");
await redisCluster.set("user:{456}:preferences", "Preferences data for user 456");

// Set keys with hash tags for user 789
await redisCluster.set("user:{789}:profile", "Profile data for user 789");
await redisCluster.set("user:{789}:settings", "Settings data for user 789");
await redisCluster.set("user:{789}:preferences", "Preferences data for user 789");

// Retrieve keys for user 123
console.log(await redisCluster.get("user:{123}:profile"))
console.log(await redisCluster.get("user:{123}:settings"))
console.log(await redisCluster.get("user:{123}:preferences"))

// Retrieve keys for user 456
console.log(await redisCluster.get("user:{456}:profile"))
console.log(await redisCluster.get("user:{456}:settings"))
console.log(await redisCluster.get("user:{456}:preferences"))

// Retrieve keys for user 789
console.log(await redisCluster.get("user:{789}:profile"))
console.log(await redisCluster.get("user:{789}:settings"))
console.log(await redisCluster.get("user:{789}:preferences"))

await redisCluster.disconnect()

/*
In Redis Cluster, the distribution of data across shards (Redis nodes) is determined by the hashing algorithm used to calculate the slot for a given key. By default, Redis uses the CRC16 algorithm to map keys to slots.

If you want to control which shard a specific key is inserted into, you can leverage the concept of hash tags in Redis. A hash tag is a substring enclosed within curly braces ({}) placed at the beginning of a key. Redis uses the content within the hash tag to determine the slot for the key, effectively allowing you to specify the shard for that key.
*/

/*
   ioredis
   https://github.com/redis/ioredis/tree/main

   Redis cluster specification
   https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/
*/
