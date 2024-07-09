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

#### I. 


#### II.


#### III. Bibliography
1. [Redis cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
2. [Redis configuration](https://redis.io/docs/latest/operate/oss_and_stack/management/config/)
3. [Question: What are the limitations of a Redis cluster?](https://www.dragonflydb.io/faq/limitations-of-redis-cluster)


### EOF (2024/07/12)