### Redis7.2.4-Homebrew-ShardCluster

Rename `dotenv` to `.env` and set parameters accordingly. 

![alt make](make.JPG)

```
md data 
cd data 
md 6379 6380 6381 6382 6383 6384 6385 6386 6387 
cd ..
```

```
make up 
make cmd 
```

```
redis-cli --user admin --pass 123456 --cluster create re1:6379 re2:6380 re3:6381 re4:6382 re5:6383 re6:6384 re7:6385 re8:6386 re9:6387 --cluster-replicas 2
```

Type `yes` and `enter`. One can use either 
```
redis-cli -c -p 6379 --user alberto --pass 123456 --no-auth-warning 
```

or 
```
redis-cli -c -h 192.168.1.11 -p 6379 --user alberto --pass 123456 --no-auth-warning
```

connect to `re1`. The rest is history...

---
### [The Road Not Taken](https://www.poetryfoundation.org/poems/44272/the-road-not-taken)


**Argument**


#### I. System Setup 
Combining instructions on [RU301](https://redis.io/university/courses/ru301/) and experience from [Redis7.2.4-Homebrew-Replication](https://github.com/Albert0i/Redis7.2.4-Homebrew-Replication), a version of `redis.conf` is devised for each node, nine in total. 
```
# redis.conf file
port 6379
cluster-enabled yes
cluster-config-file nodes6379.conf
cluster-node-timeout 5000

# Create a strong password here
requirepass 1841e88255c4b855a570dc540d9d02a1c491f94f7c8e4696be9a7f6fc1c12f82

# AUTH password of the primary instance in case this instance becomes a replica
masterauth 1841e88255c4b855a570dc540d9d02a1c491f94f7c8e4696be9a7f6fc1c12f82
. . . 
```  

It is *recommended* to have a minimum of 3 master nodes and each with 2 replicas. 

![alt 3 nodes](img/3-nodes.JPG)


#### II.


#### III. Bibliography
1. [Redis cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
2. [Redis configuration](https://redis.io/docs/latest/operate/oss_and_stack/management/config/)
3. [Question: What are the limitations of a Redis cluster?](https://www.dragonflydb.io/faq/limitations-of-redis-cluster)

["With great power comes great responsibility."](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)

### EOF (2024/07/12)