#! /bin/bash

#curl -sb -H "Accept: application/json" -H "Content-Type: application/json" http://localhost:8008/darknet/test | jq --raw-output '.code, .content'
#response=$(curl -sb -H "Accept: application/json" -H "Content-Type: application/json" http://localhost:8008/darknet/test)
ARG=$1
echo "ARG : "$ARG
findSmth=$(curl -sb -H "Accept: application/json" -H "Content-Type: application/html" http://52.78.63.210:8008/darknet/find?target=$ARG)
echo "findSmth : "$findSmth


response=$(curl -sb -H "Accept: application/json" -H "Content-Type: application/json" http://52.78.63.210:8008/darknet)
echo "response : "$response
#value=$(jq '.[$response].code')
 









#curl -sb -H "Accept: application/json" -H "Content-Type: application/json" http://localhost:8008/darknet/test

#echo $(jq '.response')
#echo $(response) | jq '.code'
