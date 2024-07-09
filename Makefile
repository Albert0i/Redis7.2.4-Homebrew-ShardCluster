#
# Import and expose environment variables
#
cnf ?= .env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

#
# Main
#
.PHONY: help build up down ps logs 

help:
	@echo
	@echo "Usage: make TARGET"
	@echo
	@echo "Redis Cluster Dockerize project automation helper for Windows version 1.5"
	@echo
	@echo "Targets:"
	@echo "	build		build image"
	@echo "	up  		start the cluster"
	@echo "	down 		stop the cluster"
	@echo "	ps 		show running containers"
	@echo "	logs		cluster logs"
	@echo 
	@echo "	cmd		start cmd on re1"
	@echo "	cli		start redis-cli on re1"
	@echo "	info		cluster info"
	@echo "	nodes		cluster nodes"
	@echo "	slots		cluster slots"
	@echo "	shards		cluster shards"
	@echo "	erase		erase cluster (danger)"
	@echo "	config		edit configuration"

#
# build image
#
build:
	docker-compose build

#
# start the cluster
#
up:
	docker-compose up -d --remove-orphans

#
# stop the cluster
#
down:
	docker-compose down -v

#
# show running containers 
#
ps:
	docker-compose ps

#
# cluster logs
#
logs:
	docker-compose logs 

#
# start cmd on re1
#
cmd:
	docker-compose exec re1 cmd

#
# start redis-cli on re1
#
cli:
	redis-cli -c --user ${AUTH_USER} --pass ${AUTH_PASS} --no-auth-warning 

#
# cluster info
#
info:	
	redis-cli --user ${AUTH_USER} --pass ${AUTH_PASS} --no-auth-warning cluster info
	
#
# cluster nodes
#
nodes:	
	redis-cli --user ${AUTH_USER} --pass ${AUTH_PASS} --no-auth-warning cluster nodes

#
# cluster slots
#
slots:	
	redis-cli --user ${AUTH_USER} --pass ${AUTH_PASS} --no-auth-warning cluster slots

#
# cluster shards
#
shards:	
	redis-cli --user ${AUTH_USER} --pass ${AUTH_PASS} --no-auth-warning cluster shards

#
# erase cluster
#
erase:
	cmd /C rm -rfvI data
	cmd /C md data\6379 data\6380 data\6381 data\6382 data\6383 data\6384 data\6385 data\6386 data\6387 	

#
# edit configuration
#
config:
	nano .env

#
# To create cluster (3x3): 
# docker-compose exec creator cmd 
# redis-cli --user default --pass 1841e88255c4b855a570dc540d9d02a1c491f94f7c8e4696be9a7f6fc1c12f82 --cluster create re1:6379 re2:6380 re3:6381 re4:6382 re5:6383 re6:6384 re7:6385 re8:6386 re9:6387 --cluster-replicas 2
#
# To create cluster (3x1): 
# redis-cli --user default --pass 1841e88255c4b855a570dc540d9d02a1c491f94f7c8e4696be9a7f6fc1c12f82 --cluster create re1:6379 re2:6380 re3:6381 --cluster-replicas 1
#
# 
# redis-cli -c --user default --pass 1841e88255c4b855a570dc540d9d02a1c491f94f7c8e4696be9a7f6fc1c12f82
# redis-cli -c --pipe --user default --pass 1841e88255c4b855a570dc540d9d02a1c491f94f7c8e4696be9a7f6fc1c12f82 < commands.redis
# 

# rebalance
# redis-cli --user default --pass 1841e88255c4b855a570dc540d9d02a1c491f94f7c8e4696be9a7f6fc1c12f82 --cluster rebalance 192.168.1.11 6379 192.168.1.12:6380  192.168.1.13:6381 192.168.1.14:6382 192.168.1.15:6383 192.168.1.16:6384 192.168.1.17:6385 192.168.1.18:6386 192.168.1.19 6387 

#
# redis-cli --user default --pass 1841e88255c4b855a570dc540d9d02a1c491f94f7c8e4696be9a7f6fc1c12f82 --cluster fix re1:6379 re2:6380 re3:6381 re4:6382 re5:6383 re6:6384 re7:6385 re8:6386 re9:6387 
#

# --cluster-search-multiple-owner --cluster-fix-with-unreachable-masters
#

#
# EOF (2024/07/12)
#

