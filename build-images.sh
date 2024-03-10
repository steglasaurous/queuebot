#!/usr/bin/env bash
# A simple script that builds docker images for the bot.
cd docker/db && docker build . --tag localhost:5000/queuebot-db:latest && cd ../..
docker build . --tag localhost:5000/queuebot:latest && cd ..
