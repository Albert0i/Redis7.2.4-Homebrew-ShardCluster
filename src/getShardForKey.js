import 'dotenv/config'
import { redisCluster } from "./config/redisCluster.js"

async function getShardForKey(key) {
    try {
      // Calculate the slot for the key
      const slot = await redisCluster.cluster('keyslot', key);
      
      // Retrieve the slot information
      const slotInfo = await redisCluster.cluster('slots');
  
      // Find the node that owns the slot
      for (const [start, end, [host, port, id, [_, hostname]]] of slotInfo) {      
        if (slot >= start && slot <= end) {
          return { slot, host, port, hostname }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      return error
    } finally {
        redisCluster.quit();
    }
  }

// Call the function with your key
console.log( await getShardForKey('age'))

// Close the connection
redisCluster.quit();
