# Setup

1. Create .env file with relevant credentials and place it in queuebot/.env

```env
# Client ID and Secret are for this app in particular. 
TWITCH_APP_CLIENT_ID=client_id_here
TWITCH_APP_CLIENT_SECRET=client_secret_here

# Twitch credentials file to use for the bot to be able to interact in chat.
# See "Getting the initial token using an OAuth code" at https://twurple.js.org/docs/auth/providers/refreshing.html
TWITCH_TOKEN_FILE=twitch_token.json
TWITCH_CHANNEL=steg_bot
```

2. Create twitch_token.json file with twitch token credentials.  Follow process detailed here: https://twurple.js.org/docs/auth/providers/refreshing.html

3. For development, run `npm run start:dev`. For production, build the docker instance (TBD)
