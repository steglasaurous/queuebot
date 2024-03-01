# Authentication

1. Goto /auth/twitch, login to twitch.

# Todo

## First

- [ ] Server: Implement queuing strategies - add 'fair queuing' strategy
  - `!rbset queuestrategy oneperuser` 
    - Sets queuing to order by one per user at a time.  Ex: if user A makes 2 requests and user B makes 1 request, the order would be: User A request 1, User B request 1, User A request 2
  - `!rbset queuestrategy random`
    - Injects the request in a random spot in the queue when it comes in.
  - `!rbset queuestrategy fifo`
    - "First In, First Out" - queuing based on first-come, first-served.  This is the default.
  - `!rbset queuestrategy default`
    - Sets the queue strategy to the default, which is `fifo`

- [ ] Server: Implement remove song from queue
- [ ] UI: Implement logout
- [ ] UI: Implement current game and queue status display  
- [ ] UI: Implement ability to open or close the queue from interface
- [ ] UI: Implement add song to queue via search/autocomplete
- [ ] UI: Implement next song button to advance the queue
- [ ] Server: Add a 'deny list' - songs that cannot be queued


## Next

- [ ] Implement auto-reconnect for websocket connections
- [ ] Remove menus from electron interface (for now)
- [ ] UI: Implement ability to change game from interface
- [ ] UI: Implement showing what's already been played
- [ ] UI: Implement clearing played history
- [ ] Server: Implement clearing played history via command
- [ ] UI: Implement rollback/undo button to reverse the queue to its previous state
- [ ] Server: Implement rollback/undo command to reverse the queue to its previous state
- [ ] `!rbget` - Return a list of requestobot settings for the channel it's in.  Broadcaster and mods only.

## Backlog

- [x] Instead of removing songs from the queue database, mark them as played.  Add cron to remove played songs after 12 hours or so.
- [x] Add concept of "current song" to keep track of what the current song in the queue is.  !nextsong should mark the song as current song. Another !nextsong should remove the current song and put the next song as the 'current song', etc.
- [x] Implement Twitch SSO
- [ ] Implement broadcaster queue manager UI
  - [x] Queue display
  - [x] Implement websocket connection to queuebot for new song notifications
  - [x] Implement drag-and-drop queue reordering
  - [ ] Next song button
  - [ ] Remove song from queue
- [ ] !remove (song #)
- [ ] Clear out queue when switching games.
- [ ] Implement a web client that shows the current queue (usable as an OBS overlay)

- [ ] !remove (song #)
- [ ] !top - Move song to the top of the queue - use title? song position? Or move last added song?
- [ ] !rollback - put the last song that was popped off the queue back on top
- [ ] Add queue controls to web client
- [ ] Allow adding songs via client?
- [ ] Add ability to set limits on how many requests can be queued per user, per role, etc.

- [ ] Importers: Only report new songs imported, vs total songs
- [ ] Spin rhythm importer: Implement song downloader to read duration and BPM data (or use API?)

- [ ] Idea: Allow adding search filters by difficulty, so streamer can limit difficulty level being requested.

Websocket gateway to expose queue state and changes for clients and 3rd party apps

Connect:
`wss://requestobot.steglasaurous.com/queue/{channelName}`

On connect: Emit entire contents of queue, including download links of each song

Events:

```
queue

{
    "channelName": "steglasaurous",
    "songRequests": { // Basically the details of the SongRequest entity
        "id": 123,
        "song": {
            "id": 234,
            "songHash": "somehash",
            "title": "Some song",
            "artist": "Some artist",
            "mapper": "Some mapper",
            "downloadUrl": "https://somesite.com/download/123"
        },
        "requesterName": "Some guy",
        "requestedOn": "2023-09-15T23:22:11Z",
        "requestOrder": 1,
    }
}
```

newRequest

```
        "id": 123,
        "song": {
            "id": 234,
            "songHash": "somehash",
            "title": "Some song",
            "artist": "Some artist",
            "mapper": "Some mapper",
            "downloadUrl": "https://somesite.com/download/123"
        },
        "requesterName": "Some guy",
        "requestedOn": "2023-09-15T23:22:11Z",
        "requestOrder": 1,

```

nextSong - same as new request data

removed

```
        "id": 123,
        "song": {
            "id": 234,
            "songHash": "somehash",
            "title": "Some song",
            "artist": "Some artist",
            "mapper": "Some mapper",
            "downloadUrl": "https://somesite.com/download/123"
        },
        "requesterName": "Some guy",
        "requestedOn": "2023-09-15T23:22:11Z",
        "requestOrder": 1,

```

orderChange

```
"id": 123,
"requestOrder": 2
```
