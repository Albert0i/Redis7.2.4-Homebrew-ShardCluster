
import 'dotenv/config'
import { Redis } from "ioredis"

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

  // Always start with 0
  await cluster.set("counter", 0);

  // Repeat for 1 hour
  for (let i=1; i<=3600; i++) {
    try {
      // Update the value 
      await cluster.incr("counter");
      
      // Read it back and display
      console.log(`counter=${await cluster.get('counter')}`)
    } 
    catch (e) {  console.log('.'); }
    // Delay for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await cluster.disconnect()

  /*
     ioredis
     https://github.com/redis/ioredis/tree/main
  */
