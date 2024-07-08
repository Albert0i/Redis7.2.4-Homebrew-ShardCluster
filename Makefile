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
	cmd /C rm -rf data
	cmd /C md data\6379 data\6380 data\6381 data\6382 data\6383 data\6384 data\6385 data\6386 data\6387 	

#
# edit configuration
#
config:
	nano .env

#
# To create cluster with: 
# docker-compose exec creator cmd 
# redis-cli --user admin --pass 123456 --cluster create re1:6379 re2:6380 re3:6381 re4:6382 re5:6383 re6:6384 re5:6383 re6:6384 re7:6385 re8:6386 re9:6387 --cluster-replicas 2
# 
# redis-cli -c --user alberto --pass 123456 
# redis-cli -c --pipe --user alberto --pass 123456 < commands.redis
# 

#
# EOF (2024/07/08)
#

