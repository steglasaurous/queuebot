# Todo

- [x] Create docker container config
- [x] Implement !getout to kick the bot out (or similar command)
- [ ] Add twitch game detection to set game to search in
- [ ] !remove (song #)
- [x] !oops - Remove last song requested by user
- [x] !nextsong - Pop the newest song off the queue
- [x] Implement proper ordering of the queue
- [x] !queue - List songs in queue
- [ ] !top - Move song to the top of the queue - use title? song position? Or move last added song?
- [x] Create a dedicated queuebot twitch account
- [ ] !rollback - put the last song that was popped off the queue back on top
- [ ] Implement a web client that shows the current queue (usable as an OBS overlay)
- [ ] Add queue controls to web client
- [ ] Allow adding songs via client?

- [ ] Add ability to set limits on how many requests can be queued per user, per role, etc. 

- [x] Load up entries for Audio Trip OSTs


- [ ] Apparently krishna appears twice
- [x] Look into why database wasn't persisted between rebuilds (docker volume)
- [x] Add exclamation in front of all messages so TTS doesn't read them by default.
