# RequestoBot (queuebot)

A song request chatbot which manages song requests for streamers playing games that don't have their own built-in
request system.  It has an up-to-date database of song details for OSTs and custom songs for each supported game.

Supported Games:
* Audio Trip
* Spin Rhythm XD
* Pistol Whip
* Dance Dash

## Getting Started

1. Goto https://twitch.tv/requestobot, click on "Chat", then type `!join` to have the bot join your channel.
2. Commands and info on how to use the bot are detailed below, as well as on requestobot's about page.  You can find that [here](https://www.twitch.tv/requestobot/about). 

## Usage

1. When setting up for a game, use `!setgame` to tell requestobot which game you're playing, so it can search through the
appropriate songs when getting requests.  For example, to set the game to Spin Rhythm XD: 

```
steglasaurous: !setgame spin rhythm xd
requestobot: ! Game changed to Spin Rhythm XD
```

Possible games are: `audio trip`, `spin rhythm xd`, `pistol whip`, `dance dash`

2. Your viewers can use `!req` to request songs.  For example: 

```
steglasaurous: !req esoteria
requestobot: ! Esoteria by Geoplex (Dama) added to the queue.
```

Using `!req` by itself will show instructions on how to request songs appropriate to the current game. Here's an example
when the game is set to Spin Rhythm XD:

```
steglasaurous: !req
requestobot: ! How to request songs: Goto https://spinsha.re for available songs.  To request, type !req title in chat. You can also request by spinsha.re id like !req 9559 or by URL !req https://spinsha.re/song/9559
```

3. To get the next song that's on the queue, use `!nextsong`.  This will show what the next request is (and by whom), and will advance the queue forward.  Example:

```
steglasaurous: !nextsong
requestobot: ! Esoteria by Geoplex (Dama) requested by @steglasaurous is next!
```

If the queue is empty, the bot will let you know:

```
steglasaurous: !nextsong
requestobot: ! No requests in queue.
```

Note that this command can only be used by the broadcaster or moderators.

There are plenty of other commands available - see below for the complete list.

Happy streaming!

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
Click on "Import" at the top of streamer.bot, paste the following text into it, then click "Import".

```
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
```

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

1. Setup .env file:
   1. For running locally (without docker), copy queuebot/env.dist to queuebot/.env and fill in the values as needed.  Note you will also need a postgres database to connect to.  You can start just the database in docker using `docker compose up db -d` to spin one up.
   2. If running with docker, copy `queuebot/env.dist` to `.env` (in the root folder) - the docker compose config will use this to populate a .env file in the container.

2. Create twitch_token.json file with twitch token credentials.  Follow process detailed here: https://twurple.js.org/docs/auth/providers/refreshing.html

3. Run `npm run start:dev` to start the server.

