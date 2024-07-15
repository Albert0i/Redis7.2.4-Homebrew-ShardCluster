  import 'dotenv/config'
  import { redisCluster } from "../src/config/redisCluster.js"
  import assert from 'assert'

  // Main
  const keyname = 'person:ids'
  const fieldname = "visited"

  const card = await redisCluster.scard(keyname)
  const members = await redisCluster.smembers(keyname)
  assert.strictEqual(members.length, card, "Error in scard and smember.")
  
  // Set field "visited" to 1
  for (let i=0; i < members.length; i++) 
    await setField(members[i], fieldname, 1)

  // Test field "visited" value 
  for (let i=0; i < members.length; i++) 
      await testField(members[i], fieldname, 1)  
  
  // Add 2 to field "visited"
  for (let i=0; i < members.length; i++) 
    await addField(members[i], fieldname, 2)

  // Test field "visited" value 
  for (let i=0; i < members.length; i++) 
      await testField(members[i], fieldname, 3)

  // Delete field "visited"
  for (let i=0; i < members.length; i++) 
    await delField(members[i], fieldname)  

  await redisCluster.disconnect()

  async function setField(key, field, value) {
    return await redisCluster.hset(key, field, value)
  }

  async function addField(key, field, value) {
    return await redisCluster.hincrby(key, field, value)
  }

  async function testField(key, field, value) {
    let retval = await redisCluster.hget(key, field)
    if (retval != value) 
        console.log(`key = ${key}, got value=${retval}, expected value=${value}`)
  }
  
  async function delField(key, field) {
    return await redisCluster.hdel(key, field)
  }  

  /*
     ioredis
     https://github.com/redis/ioredis/tree/main
  */
