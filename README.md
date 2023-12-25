# RequestoBot (queuebot)

A song request chat bot which manages song requests for streamers playing games that don't have their own built-in
request system.  

## How to use

1. Goto https://twitch.tv/requestobot, click on "Chat", then type `!join` to have the bot join your channel.
2. Commands and info on how to use the bot are detailed on the requestobot's about page.  You can find that [here](https://www.twitch.tv/requestobot/about). 

## Command List

**!setgame** - Set the game the bot should search requests with.  This would be the game name similar to how you'd see it on Twitch.  Examples: **!setgame audio trip**, **!setgame spin rhythm xd**

**!req** - Add a song request to the queue.  Use the song title to request a song.  If more than one song matches, you will be presented with a list of matches, and can respond with **!req #1** to select the first song, **!req #2** to select the second song, etc.

Also note using **!req** on its own will show instructions on how to request songs, and where to find songs for the current game.

**!oops** - Requested the wrong song?  This removes the last song request you made.

**!nextsong** - For broadcaster and mods only.  Takes the next song off the top of the request queue and posts it to chat.  This removes the song from the request queue.

**!queue** - Shows the list of songs in the queue.  If the queue is too long, only the top 5 songs are shown, with a count of how many additional songs there are.

**!clear** - For broadcasters and mods only.  This completely clears the request queue.

**!close** - Close the queue from requests so viewers cannot add new requests to the queue. Note that the broadcaster and mods can still add requests even if it's closed.

**!open** - Open the queue for requests from anyone.

**!requestobot off** - This turns off all commands until you turn them back on with **!requestobot on**.  This is a way of disabling the bot without removing it from your channel.

**!requestobot on** - Enable the bot to respond to commands in your channel.

**!getout** - Broadcaster and mods only. Have requestobot leave your channel.  Once left, commands will not work until you invite the bot into your channel again.

## Song Auto-downloader

For those that use <a href="https://streamer.bot/">streamer.bot</a> you can take advantage of the auto-downloader, which
automatically downloads songs requested via requestobot that you don't already have in your game. 

> NOTE: Spin Rhythm XD is the only supported game at the moment.

### What you need

- [Streamer.bot](https://streamer.bot) 0.2.2 or better


### Instructions

#### Step 1: Create a Websocket client
In Streamer.bot, goto the Servers/Clients tab, then the Websocket Clients tab.
Right click, and click Add to add a new Websocket Client.

Fill in the following:

- Name: Requestobot
- Endpoint: wss://queuebot.steglasaurous.com/
- Auto Connect on Startup: Checked
- Reconnect on Disconnect: Checked
- On the right, ensure that TLS 1.2 is checked.
- Retry Interval: 30s
- Click OK

#### Step 2: Import Requestobot Actions
Click on "Import" at the top of streamer.bot and paste the following text into it, then click "Import".

![Actions](streamerbot-actions/auto-downloader.txt)

#### Step 3: Configure
1. Click on the Actions tab
2. Find the action "Requestobot Connect" and click on it to show its subactions and triggers
3. Under triggers, double-click on "Websocket Client", then in the dropdown list shown, choose "Requestobot" and press OK
4. Under Sub-actions, double click on "Set argument %channelName%" to edit it.  Under "Value", replace steglasaurous with your channel name, then press OK
5. Find the action "Requestobot Message" and click on it to show its subactions and triggers.
6. Under triggers, double-click on "Websocket Client", then in the dropdown list shown, choose "Requestobot" and press OK

#### Step 4: Connect Websocket client
1. Goto the Servers/Clients tab, then the Websocket Clients tab.
2. Right-click on the websocket client you added in Step 1, and click "Connect".  You'll only need to do this once.

#### Step 5: Test!

Fire up Spin Rhythm XD, then in your twitch chat, make a request for a song you don't already have.  Confirm the song
shows up in Spin!

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
