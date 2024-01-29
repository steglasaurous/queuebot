build: queuebot/dist queuebot-client/dist

package-client: queuebot-client/dist
	cd queuebot-client && npm run make

queuebot/dist: common/index.d.ts queuebot/node_modules
	cd queuebot && npm run build

queuebot/node_modules: queuebot/package.json queuebot/package-lock.json
	cd queuebot && npm ci

# For dev, probably don't need to build until we run the app itself.
queuebot-client/dist: common/index.d.ts queuebot-client/node_modules
	cd queuebot-client && npm run build

queuebot-client/node_modules: queuebot-client/package.json queuebot-client/package-lock.json
	cd queuebot-client && npm ci

common/index.d.ts: common/node_modules common/index.ts
	cd common && npx tsc -p ./tsconfig.json

common/node_modules: common/package.json common/package-lock.json
	cd common && npm ci

start-server: queuebot/dist queuebot/.env
	cd queuebot && npm run typeorm:run-migrations && npm run start

queuebot/.env: .env
	cp .env queuebot/.env

clean:
	rm -rf \
	queuebot/node_modules \
  	queuebot-client/node_modules \
  	queuebot/dist \
  	queuebot-client/dist \
  	queuebot-client/main-process/*.js \
  	queuebot-client/out common/index.d.ts* \
  	common/index.js* \
  	common/queuebot-dto/*.js \
  	common/queuebot-dto/*.map \
  	common/node_modules \
  	common/tsconfig.tsbuildinfo

