#!/usr/bin/env bash
# FIXME: Add .env params configured here
# FIXME: Add twitch_token.json to a docker volume so it survives upgrades.
cd /server && npm run typeorm:run-migrations && npm run start
