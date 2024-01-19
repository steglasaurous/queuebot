# Authentication

1. Goto /auth/twitch, login to twitch.


# Todo
- [x] Instead of removing songs from the queue database, mark them as played.  Add cron to remove played songs after 12 hours or so.
- [x] Add concept of "current song" to keep track of what the current song in the queue is.  !nextsong should mark the song as current song. Another !nextsong should remove the current song and put the next song as the 'current song', etc.
- [ ] Implement Twitch SSO
- [ ] Implement broadcaster queue manager UI
  - [ ] Queue display
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
