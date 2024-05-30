FROM couchbase/server:latest AS stage_base

COPY init-cbserver.sh /opt/couchbase/init/
COPY *.json /opt/couchbase/init/

#update permissions to run the script
RUN chmod +x /opt/couchbase/init/init-cbserver.sh