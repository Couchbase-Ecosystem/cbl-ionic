#!/bin/bash
# used to start couchbase server - can't get around this as docker compose only allows you to start one command - so we have to start couchbase like the standard couchbase Dockerfile would
# https://github.com/couchbase/docker/blob/master/enterprise/couchbase-server/7.2.0/Dockerfile#L88

/entrypoint.sh couchbase-server &

# track if setup is complete so we don't try to setup again
FILE=/opt/couchbase/init/setupComplete.txt

if ! [ -f "$FILE" ]; then
  # used to automatically create the cluster based on environment variables
  # https://docs.couchbase.com/server/current/cli/cbcli/couchbase-cli-cluster-init.html

  echo $COUCHBASE_ADMINISTRATOR_USERNAME ":"  $COUCHBASE_ADMINISTRATOR_PASSWORD

  sleep 10s
  /opt/couchbase/bin/couchbase-cli cluster-init -c 127.0.0.1 \
  --cluster-username $COUCHBASE_ADMINISTRATOR_USERNAME \
  --cluster-password $COUCHBASE_ADMINISTRATOR_PASSWORD \
  --services data,index,query,eventing \
  --cluster-ramsize $COUCHBASE_RAM_SIZE \
  --cluster-index-ramsize $COUCHBASE_INDEX_RAM_SIZE \
  --cluster-eventing-ramsize $COUCHBASE_EVENTING_RAM_SIZE \
  --cluster-analytics-ramsize $COUCHBASE_ANALYTICS_RAM_SIZE \
  --index-storage-setting default

  sleep 2s

  # used to auto create the bucket based on environment variables
  # https://docs.couchbase.com/server/current/cli/cbcli/couchbase-cli-bucket-create.html

  /opt/couchbase/bin/couchbase-cli bucket-create -c localhost:8091 \
  --username $COUCHBASE_ADMINISTRATOR_USERNAME \
  --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
  --bucket $COUCHBASE_BUCKET \
  --bucket-ramsize $COUCHBASE_BUCKET_RAMSIZE \
  --bucket-type couchbase

  sleep 2s

  # Create the scopes
  #
  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-scope audit

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-scope rbac

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-scope sales

  # Create the collections
  #
  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection audit.inventory

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection audit.projects

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection rbac.userProfiles

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.customer

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.district

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.history

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.item

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.newOrder

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.order

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.orderLilne

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.stock

  /opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket $COUCHBASE_BUCKET \
    --create-collection sales.warehouse

  # used to auto create the sync gateway user based on environment variables
  # https://docs.couchbase.com/server/current/cli/cbcli/couchbase-cli-user-manage.html#examples

  /opt/couchbase/bin/couchbase-cli user-manage \
  --cluster http://127.0.0.1 \
  --username $COUCHBASE_ADMINISTRATOR_USERNAME \
  --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
  --set \
  --rbac-username $COUCHBASE_RBAC_USERNAME \
  --rbac-password $COUCHBASE_RBAC_PASSWORD \
  --roles mobile_sync_gateway[*] \
  --auth-domain local

  sleep 2s

  # create indexes using the QUERY REST API

  # import sample data into the bucket
  # https://docs.couchbase.com/server/current/tools/cbimport-json.html

  /opt/couchbase/bin/cbimport json --format list \
  -c http://localhost:8091 \
  -u $COUCHBASE_ADMINISTRATOR_USERNAME \
  -p $COUCHBASE_ADMINISTRATOR_PASSWORD \
  -b $COUCHBASE_BUCKET \
  --scope-collection-exp sales.customer \
  -d "file:///opt/couchbase/init/sample-customers.json" -g %customerId%

  /opt/couchbase/bin/cbimport json --format list \
  -c http://localhost:8091 \
  -u $COUCHBASE_ADMINISTRATOR_USERNAME \
  -p $COUCHBASE_ADMINISTRATOR_PASSWORD \
  -b $COUCHBASE_BUCKET \
  --scope-collection-exp sales.district \
  -d "file:///opt/couchbase/init/sample-districts.json" -g %districtId%

  /opt/couchbase/bin/cbimport json --format list \
  -c http://localhost:8091 \
  -u $COUCHBASE_ADMINISTRATOR_USERNAME \
  -p $COUCHBASE_ADMINISTRATOR_PASSWORD \
  -b $COUCHBASE_BUCKET \
  --scope-collection-exp sales.item \
  -d "file:///opt/couchbase/init/sample-items.json" -g %itemId%

  /opt/couchbase/bin/cbimport json --format list \
  -c http://localhost:8091 \
  -u $COUCHBASE_ADMINISTRATOR_USERNAME \
  -p $COUCHBASE_ADMINISTRATOR_PASSWORD \
  -b $COUCHBASE_BUCKET \
  --scope-collection-exp audit.projects \
  -d "file:///opt/couchbase/init/sample-projects.json" -g %projectId%


  /opt/couchbase/bin/cbimport json --format list \
  -c http://localhost:8091 \
  -u $COUCHBASE_ADMINISTRATOR_USERNAME \
  -p $COUCHBASE_ADMINISTRATOR_PASSWORD \
  -b $COUCHBASE_BUCKET \
  --scope-collection-exp sales.warehouse \
  -d "file:///opt/couchbase/init/sample-warehouses.json" -g %warehouseId%



  # create file so we know that the cluster is setup and don't run the setup again
  touch $FILE
fi
  # docker compose will stop the container from running unless we do this
  # known issue and workaround
  tail -f /dev/null

