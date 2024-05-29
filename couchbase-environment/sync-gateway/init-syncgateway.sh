#!/bin/bash
# used to start sync - can't get around this as docker compose only allows you to start one command - so we have to start sync gateway like the standard sync gateway Dockerfile would 
# https://github.com/couchbase/docker/blob/master/enterprise/sync-gateway/3.0.3/Dockerfile#L27

# track if setup is complete so we don't try to setup again
FILE=/setupComplete.txt

if ! [ -f "$FILE" ]; then
	sleep 30s 
	# create file so we know that the cluster is setup and don't run the setup again 
	/entrypoint.sh /etc/sync_gateway/sync_gateway.json & 

	sleep 30s 
    # https://docs.couchbase.com/sync-gateway/current/configuration-schema-database.html

	#create databases for each scope - a database is limited to 1 scope and 1000 collections
	# https://docs.couchbase.com/sync-gateway/current/configuration-schema-database.html
	# https://docs.couchbase.com/sync-gateway/current/scopes-and-collections-config.html
	echo "Creating audit database\n"
	/bin/curl --location --request PUT 'http://localhost:4985/audit/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ 
	"bucket": "inventoryDemo", 
	"num_index_replicas": 0,
	"scopes": {
		"audit": {
			"collections": {
				"projects":{
					"sync": "function sync(doc, oldDoc) { console.log(\"********Processing Team Docs\"); validateNotEmpty(\"team\", doc.team); if (!isDelete()) { var team = getTeam(); var channelId = \"channel.\" + team; console.log(\"********Setting Channel to \" + channelId); channel(channelId); requireRole(team); access(\"role:team1\", \"channel.team1\"); access(\"role:team2\", \"channel.team2\"); access(\"role:team3\", \"channel.team3\"); access(\"role:team4\", \"channel.team4\"); access(\"role:team5\", \"channel.team5\"); access(\"role:team6\", \"channel.team6\"); access(\"role:team7\", \"channel.team7\"); access(\"role:team8\", \"channel.team8\"); access(\"role:team9\", \"channel.team9\"); access(\"role:team10\", \"channel.team10\"); } function getTeam() { return isDelete() ? oldDoc.team : doc.team; } function isDelete() { return doc._deleted == true; } function validateNotEmpty(key, value) { if (!value) { throw { forbidden: key + \" is not provided.\" }; } } }",
					"import_filter": "function(doc) { if (doc.isActive === true){ return true; } return false; }"
				},
				"inventory":{
					"sync": "function sync(doc, oldDoc) { console.log(\"********Processing Team Docs\"); validateNotEmpty(\"team\", doc.team); if (!isDelete()) { var team = getTeam(); var channelId = \"channel.\" + team; console.log(\"********Setting Channel to \" + channelId); channel(channelId); requireRole(team); access(\"role:team1\", \"channel.team1\"); access(\"role:team2\", \"channel.team2\"); access(\"role:team3\", \"channel.team3\"); access(\"role:team4\", \"channel.team4\"); access(\"role:team5\", \"channel.team5\"); access(\"role:team6\", \"channel.team6\"); access(\"role:team7\", \"channel.team7\"); access(\"role:team8\", \"channel.team8\"); access(\"role:team9\", \"channel.team9\"); access(\"role:team10\", \"channel.team10\"); } function getTeam() { return isDelete() ? oldDoc.team : doc.team; } function isDelete() { return doc._deleted == true; } function validateNotEmpty(key, value) { if (!value) { throw { forbidden: key + \" is not provided.\" }; } } }",
					"import_filter": "function(doc) { if (doc.isActive === true){ return true; } return false; }"
				}
			}
 		}			
	}
}'		

	echo "Creating rbac database\n"
	/bin/curl --location --request PUT 'http://localhost:4985/rbac/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "bucket": "inventoryDemo", "num_index_replicas": 0 }'

	echo "Creating sales database\n"
	/bin/curl --location --request PUT 'http://localhost:4985/sales/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "bucket": "inventoryDemo", "num_index_replicas": 0 }'

	#create roles for audit
	echo "Creating roles for audit\n"
	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team1/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team1", "collection_access": { "audit": { "projects": { "admin_channels": ["team1"] }, "inventory": { "admin_channels": ["team1"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team2/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team2", "collection_access": { "audit": { "projects": { "admin_channels": ["team2"] }, "inventory": { "admin_channels": ["team2"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team3/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team3", "collection_access": { "audit": { "projects": { "admin_channels": ["team3"] }, "inventory": { "admin_channels": ["team3"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team4/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team4", "collection_access": { "audit": { "projects": { "admin_channels": ["team4"] }, "inventory": { "admin_channels": ["team4"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team5/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team5", "collection_access": { "audit": { "projects": { "admin_channels": ["team5"] }, "inventory": { "admin_channels": ["team5"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team6/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team6", "collection_access": { "audit": { "projects": { "admin_channels": ["team6"] }, "inventory": { "admin_channels": ["team6"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team7/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team7", "collection_access": { "audit": { "projects": { "admin_channels": ["team7"] }, "inventory": { "admin_channels": ["team7"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team8/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team8", "collection_access": { "audit": { "projects": { "admin_channels": ["team8"] }, "inventory": { "admin_channels": ["team8"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team9/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team9", "collection_access": { "audit": { "projects": { "admin_channels": ["team9"] }, "inventory": { "admin_channels": ["team9"] } } } }'

	/bin/curl --location --request PUT 'http://localhost:4985/audit/_role/team10/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "name": "team10", "collection_access": { "audit": { "projects": { "admin_channels": ["team10"] }, "inventory": { "admin_channels": ["team10"] } } } }'

	#create users 

	echo "Creating users for audit\n"
	/bin/curl --location --request PUT 'http://localhost:4985/audit/_user/demo@example.com/' \
	--header 'Content-Type: application/json' \
	--data-raw '{ "password": "P@ssw0rd12", "admin_roles": ["team1"], "name": "Demo User", "email": "demo@example.com" }'
		
  	touch $FILE
else 
	sleep 10s 
	/entrypoint.sh /etc/sync_gateway/config.json & 
fi



# docker compose will stop the container from running unless we do this
# known issue and workaround
tail -f /dev/null