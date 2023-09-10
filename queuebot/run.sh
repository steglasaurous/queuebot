#!/usr/bin/env bash
envsubst < /server/.env.dist > /server/.env
cd /server && npm run typeorm:run-migrations && npm run start
