
import 'dotenv/config'
import { Redis } from "ioredis"

const redis = new Redis(
  {
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    username: process.env.AUTH_USER, // needs Redis >= 6
    password: process.env.AUTH_PASS,
    db: 0, // Defaults to 0,
    enableAutoPipelining: true, 
    showFriendlyErrorStack: true
  }
);

  // Always start with 0
  await redis.set("counter", 0);

  // Repeat for 1 hour
  for (let i=1; i<=3600; i++) {
    try {
      // Update the value 
      await redis.incr("counter");
      
      // Read it back and display
      console.log(`counter=${await redis.get('counter')}`)
    } 
    catch (e) {  console.log('.'); }
    // Delay for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await redis.disconnect()

  /*
     ioredis
     https://github.com/redis/ioredis/tree/main
  */
