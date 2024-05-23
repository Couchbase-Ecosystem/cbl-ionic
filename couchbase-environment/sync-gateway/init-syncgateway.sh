#!/bin/bash
# used to start sync - can't get around this as docker compose only allows you to start one command - so we have to start sync gateway like the standard sync gateway Dockerfile would 
# https://github.com/couchbase/docker/blob/master/enterprise/sync-gateway/3.0.3/Dockerfile#L27

# track if setup is complete so we don't try to setup again
FILE=/setupComplete.txt

if ! [ -f "$FILE" ]; then
	sleep 30s 
	# create file so we know that the cluster is setup and don't run the setup again 
	/entrypoint.sh /etc/sync_gateway/config.json & 

	#create database
	/bin/curl --location --request PUT 'http://localhost:4985/inventoryDb' \
	-u admin:P@$w0rd12 \
	--header 'Content-Type: application/json' \
	--data-raw '{ "bucket": "inventoryDemo", "num_index_replicas": 0 }'

  	touch $FILE
else 
	sleep 10s 
	/entrypoint.sh /etc/sync_gateway/config.json & 
fi



# docker compose will stop the container from running unless we do this
# known issue and workaround
tail -f /dev/null