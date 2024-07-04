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

connect to `re1` and so on... 
