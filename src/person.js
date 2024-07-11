
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

  // Main
  const members = await cluster.smembers('person:ids')
  assert(members.length === 1030)

  // Set field "visited" to 0
  for (let i=0; i < members.length; i++) 
    await setField(members[i], "visited", 0)

  // Test field "visited" value 
  for (let i=0; i < members.length; i++) {
      await testField(members[i], "visited", 0)
  }
  
  // Add 1 to field "visited"
  for (let i=0; i < members.length; i++) 
    await addField(members[i], "visited", 2)

  // Test field "visited" value 
  for (let i=0; i < members.length; i++) {
      await testField(members[i], "visited", 2)
  }

  await cluster.disconnect()

  async function setField(key, field, value) {
    return await cluster.hset(key, field, value)
  }

  async function addField(key, field, value) {
    return await cluster.hset(key, field, value)
  }

  async function testField(key, field, value) {
    let retval = await cluster.hget(key, field)
    if (parseInt(retval, 10) !== value) 
        console.log(`key = ${key}, returned value=${retval}, expected value=${value}`)
  }
  
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  /*
     ioredis
     https://github.com/redis/ioredis/tree/main
  */
