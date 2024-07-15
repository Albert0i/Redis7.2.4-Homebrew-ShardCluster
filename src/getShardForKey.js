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

/*
Determining which shard (Redis node) stores a specific key is useful in scenarios where you want to locate or distribute the workload associated with that key. Pre-determining the shard for a key can provide benefits such as:

1. Efficient Key Lookup: If you know which shard contains a particular key, you can directly connect to that specific shard to retrieve or manipulate the key's value. This approach avoids the need to broadcast the request to all shards or perform additional operations to locate the key.

2. Optimized Data Placement: By pre-determining shards for keys, you can strategically distribute the keys across the Redis Cluster nodes based on various criteria, such as load balancing or proximity to related data. This can help achieve better performance and resource utilization.

3. Scaling Considerations: When scaling a Redis Cluster, it's often necessary to redistribute keys across additional shards or nodes. By pre-determining the shard for a key, you can plan the redistribution process more effectively and minimize the impact on key availability and performance.

4. Cache Affinity: In caching scenarios, pre-determining the shard for a key can help maintain cache affinity. Cache affinity refers to the ability to consistently access related data stored in the same shard, which can improve cache hit rates and reduce data retrieval latencies.

5. Shard-Specific Operations: If you have specific operations or processing logic that needs to be performed on a key, pre-determining the shard allows you to target those operations to the relevant shard directly.

It's important to note that pre-determining the shard for a key requires careful planning and coordination, as it involves understanding the Redis Cluster's topology, slot allocation, and key distribution mechanisms. Additionally, you need to consider the trade-offs between data distribution, redundancy, and the potential need for rebalancing when adding or removing nodes from the cluster.

*/