  import 'dotenv/config'
  import { redisCluster } from "../src/config/redisCluster.js"
  import assert from 'assert'  

  // Main
  const keyname = 'person:ids'
  const fieldname = "visited"

  const card = await redisCluster.scard(keyname)
  let members1 = []
  let members2 = []
  
  for (let i=0; i<10; i++) {
    members1 = await smembers(keyname)
    assert(members1.length === card)
    members2 = await getAllSetElements(redisCluster, keyname)
    assert(members2.length === card)
    
    console.log(`card=${card}, length1=${members1.length}, length2=${members2.length}`)  

    // if (card < members.length) {
    //   const duplicatedElements = findDuplicates(members);
    //   console.log(duplicatedElements);
    // }
  }

  function findDuplicates(array) {
    const uniqueElements = new Set();
    const duplicates = new Set();
  
    for (const element of array) {
      if (uniqueElements.has(element)) {
        duplicates.add(element);
      } else {
        uniqueElements.add(element);
      }
    }
  
    return Array.from(duplicates);
  }

  // members = await smembers(keyname)
  // console.log(`card=${card}, length=${members.length}`)
    
  // members = await smembers('person:ids')
  // //assert(members.length === 1030)
  // console.log(members.length) 

  // // Set field "visited" to 0
  // for (let i=0; i < members.length; i++) 
  //   await setField(members[i], "visited", 0)

  // members = await smembers('person:ids')
  // //assert(members.length === 1030)
  // console.log(members.length) 
  // // Test field "visited" value 
  // for (let i=0; i < members.length; i++) {
  //     await testField(members[i], "visited", 0)
  // }
  
  // members = await smembers('person:ids')
  // //assert(members.length === 1030)
  // console.log(members.length) 
  // // Add 1 to field "visited"
  // for (let i=0; i < members.length; i++) 
  //   await addField(members[i], "visited", 1)

  // members = await smembers('person:ids')
  // //assert(members.length === 1030)
  // console.log(members.length) 
  // // Test field "visited" value 
  // for (let i=0; i < members.length; i++) {
  //     await testField(members[i], "visited", 1)
  // }

  await redisCluster.disconnect()

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
        [ cursor, ids ] = await redisCluster.sscan(key, cursor)
        // console.log(`cursor=${cursor}, ids=${ids}`)
        // console.log(`cursor=${typeof cursor}, ids=${typeof ids}`)
        for (const [_, value] of Object.entries(ids)) 
            members = [...members, value]    
    } while (cursor !== '0' ) 
    return members
  }

  // async function getAllSetElements(redisClient, key) {
  //   const elements = [];
  //   let cursor = '0';
    
  //   do {
  //     const result = await redisClient.sscan(key, cursor);
  //     cursor = result[0];
  //     const scannedElements = result[1];
      
  //     elements.push(...scannedElements);
  //   } while (cursor !== '0');
    
  //   return elements;
  // }
  async function getAllSetElements(redisClient, key) {
    const totalCount = await redisClient.scard(key);
    const elements = [];
    let cursor = '0';
    let scannedCount = 0;
  
    do {
      const result = await redisClient.sscan(key, cursor);
      cursor = result[0];
      const scannedElements = result[1];
  
      elements.push(...scannedElements);
      scannedCount += scannedElements.length;
    } while (cursor !== '0');
  
    if (totalCount !== scannedCount) {
      console.warn('Warning: Inconsistent count between SCARD and SSCAN');
    }
  
    return elements
  }

  /*
     ioredis
     https://github.com/redis/ioredis/tree/main
  */
