#!/bin/bash

if [ $# -ne 2 ]
then
  echo "params invalid"
  exit;
fi;

#if [ $1 == "-amount" ]
#then
#  AMOUNT=$2;
#else
#  echo "forgot amount flag";
#  exit;
#fi;

if [ $1 == "-to" ]
then
  TO_ACCOUNT=$2
else
  echo "forgot to flag";
  exit;
fi

AMOUNT=1

FUNDED_ACCOUNT=$(yarn hardhat accounts | awk 'NR==3{ print $1 }')
yarn hardhat send --from $FUNDED_ACCOUNT --amount $AMOUNT --to $TO_ACCOUNT > /dev/null
if [ $? -eq 0 ]
then
  echo "$AMOUNT ETH sent to $TO_ACCOUNT"
else
  echo "something went wrong, eth probably was not sent"
fi
