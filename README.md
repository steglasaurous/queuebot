# RequestoBot (queuebot)

A song request chat bot which manages song requests for streamers playing games that don't have their own built-in
request system.  

## How to use

1. Goto https://twitch.tv/requestobot, click on "Chat", then type `!join` to have the bot join your channel.
2. Commands and info on how to use the bot are detailed on the requestobot's about page- you can find that [here](https://www.twitch.tv/requestobot/about). 

## Feature Requests and Bugs

If you have feature requests, would like to see the bot do something differently, or want to file a bug report, please
use the github issues tab to do so.  Always happy to take feedback.

Although I'll do the best I can to address issues and features, I do this purely on a volunteer basis, so I cannot guarantee
your feature will be implemented, or in a timely fashion.  Also note use of this bot is on an as-is basis so use at your own risk.

Having said that, I hope it's useful to you! Enjoy!

# Development Details

Everything below here is useful if you want to contribute towards developing the bot yourself.

## Setup

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
