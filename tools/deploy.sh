#!/bin/sh

cd ..

cd game && grunt deploy && cd ..

cd models && grunt deploy && cd ..

cd pomelo && grunt deploy && cd ..

cd server && grunt deploy && cd ..

cd web-server && grunt deploy && cd ..
