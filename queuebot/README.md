# Todo

# Goal

1. Get working prototype of electron app, send to internal testers

## First

- [x] UI: Implement next song button to advance the queue
- [x] Server: Implement song-request PUT to modify a request (setting song as active)
- [x] UI: Implement selecting active song
- [x] Server: Implement change channel settings API
- [x] UI: Implement ability to open or close the queue from interface
- [x] UI: Implement ability to change game from interface
- [x] UI: Implement showing downloaded status of each song (not downloaded, download progress, present locally)
- [x] UI: Create an installable package, test on a new machine
- [x] Deploy server changes to production

## Next
- [ ] Add 
- [ ] Implement missing unit and e2e tests
- [ ] Server: Implement song-requests POST to create new song request via API
- [ ] Server: Implement songs GET to search for songs
- [ ] UI: Implement add song to queue via search/autocomplete
- [ ] Remove menus from electron interface (for now)
- [ ] Implement unit tests for client components
- [ ] Server: Clear out queue when switching games.
- [ ] UI: Sketch out how I might clean up the UI / make it look slick
- [ ] Server: Implement clearing played history via command
- [ ] UI: Implement showing what's already been played
- [ ] UI: Implement clearing played history (vs clearing queue completely)
- [ ] UI: Implement rollback/undo button to reverse the queue to its previous state
- [ ] `!rbget` - Return a list of requestobot settings for the channel it's in.  Broadcaster and mods only.
- [ ] Implement a web client that shows the current queue (usable as an OBS overlay)
- [ ] Server: Add a 'deny list' - songs that cannot be queued
- [ ] UI: Figure out how windows package signing works, see if I can do it cheaply

## Backlog

- [ ] Server: Implement rollback/undo command to reverse the queue to its previous state
- [ ] !top - Move song to the top of the queue - use title? song position? Or move last added song?
- [ ] !rollback - put the last song that was popped off the queue back on top
- [ ] Add ability to set limits on how many requests can be queued per user, per role, etc.
- [ ] Importers: Only report new songs imported, vs total songs
- [ ] Spin rhythm importer: Implement song downloader to read duration and BPM data (or use API?)
- [ ] Idea: Allow adding search filters by difficulty, so streamer can limit difficulty level being requested.

## Done

- [x] UI: Implement logout
- [x] UI: Implement current game and queue status display
- [x] Implement CSS using tailwind
- [x] Server: Implement remove song from queue command !remove
- [x] Server: Implement remove song from queue API
- [x] Server: Get e2e tests working for API endpoints (cookieParser() not working in test)
- [x] UI: Implement remove song
- [x] Implement auto-reconnect for websocket connections
- [x] Server: Implement queuing strategies - add 'fair queuing' strategy
  - `!rbset queuestrategy oneperuser`
    - Sets queuing to order by one per user at a time.  Ex: if user A makes 2 requests and user B makes 1 request, the order would be: User A request 1, User B request 1, User A request 2
  - `!rbset queuestrategy random`
    - Injects the request in a random spot in the queue when it comes in.
  - `!rbset queuestrategy fifo`
    - "First In, First Out" - queuing based on first-come, first-served.  This is the default.
  - `!rbset queuestrategy default`
    - Sets the queue strategy to the default, which is `fifo`
- [x] Server: Send queue update websocket messages whenever the queue changes
- [x] UI: Update queue state on all update events
- [x] Instead of removing songs from the queue database, mark them as played.  Add cron to remove played songs after 12 hours or so.
- [x] Add concept of "current song" to keep track of what the current song in the queue is.  !nextsong should mark the song as current song. Another !nextsong should remove the current song and put the next song as the 'current song', etc.
- [x] Implement Twitch SSO

