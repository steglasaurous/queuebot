# Development

To run electron app: `make start-client`

To run in a browser with ng serve:

1. Start the electron app
2. Login to twitch
3. Open dev tools in electron app, get JWT from network request cookie
4. Start client with `ng serve --open` which will open a browser
5. In browser, add keys to localStorage:

| key              | contents should be...  |
|------------------|------------------------|
| setting:jwt      | JWT copied from cookie |
| setting:username | twitch username        |

6. Refresh browser page

# Todo

- [ ] Implement method of auth that works with electron AND browser

