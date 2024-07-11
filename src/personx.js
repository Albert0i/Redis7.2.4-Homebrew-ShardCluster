
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
  let members = [] 
  members = await smembers('person:ids')
  //assert(members.length === 1030)
  console.log(members.length) 

  // Set field "visited" to 0
  for (let i=0; i < members.length; i++) 
    await setField(members[i], "visited", 0)

  members = await smembers('person:ids')
  //assert(members.length === 1030)
  console.log(members.length) 
  // Test field "visited" value 
  for (let i=0; i < members.length; i++) {
      await testField(members[i], "visited", 0)
  }
  
  members = await smembers('person:ids')
  //assert(members.length === 1030)
  console.log(members.length) 
  // Add 1 to field "visited"
  for (let i=0; i < members.length; i++) 
    await addField(members[i], "visited", 1)

  members = await smembers('person:ids')
  //assert(members.length === 1030)
  console.log(members.length) 
  // Test field "visited" value 
  for (let i=0; i < members.length; i++) {
      await testField(members[i], "visited", 1)
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
  
  async function smembers(key) {
    let members = []
    let cursor = "0"
    let ids = {}

    do {
        [ cursor, ids ] = await cluster.sscan(key, cursor)    
        for (const [_, value] of Object.entries(ids)) 
            members = [...members, value]    
    } while (cursor !== '0' ) 
    return members
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
