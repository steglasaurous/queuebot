# Development

To run electron app, from the root of the repository run: `make start-client`

To run in a browser with ng serve, first run `make build` to ensure all dependencies are installed, then: 

1. `cd queuebot-client`
2. `npx ng serve`

# How the client is organized

```
/
  -- main-process                  Electron-specific code
    -- downloader/                 Auto-downloader code
      -- handlers/                 Game-specific download handlers.  Implement the DownloadHandler interface to create a new one.
      -- song-downloader.ts        Song downloader service - handles finding the right handler to process a song for download
    -- 


```
