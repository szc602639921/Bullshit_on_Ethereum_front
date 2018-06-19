#! /bin/bash

RUNNING=`ps aux | grep [g]anache`
if [ -z "$RUNNING" ]; then
	../ganache-1.1.0-x86_64.AppImage &
else
	echo 'Ganache already running'
fi
cd ../streebog
rm -r build
truffle compile
truffle migrate
cd ../streebog_frontend 
chromium-browser http://localhost:3000 --auto-open-devtools-for-tabs &
npm start
