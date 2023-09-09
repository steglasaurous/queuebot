#!/usr/bin/env bash
cd /server && npm run typeorm:run-migrations && npm run start
