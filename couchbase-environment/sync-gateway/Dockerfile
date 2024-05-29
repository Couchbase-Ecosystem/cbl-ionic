FROM couchbase/sync-gateway:latest AS stage_base
COPY sync_gateway.json /etc/sync_gateway/sync_gateway.json
COPY init-syncgateway.sh /opt/couchbase-sync-gateway/init/init-syncgateway.sh