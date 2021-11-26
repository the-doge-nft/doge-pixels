#!/bin/bash

brew services start redis
pm2 start ./src/index.js --name dog_server
