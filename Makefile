build-dev: queuebot/dist queuebot-client/dist queuebot-overlay/dist queuebot/.env

build: queuebot/dist queuebot-client/dist queuebot-overlay/dist

rebuild: queuebot/node_modules queuebot-client/node_modules
	rm -rf queuebot/dist queuebot-client/dist queuebot/.env queuebot-client/src/environments/environment.ts queuebot-client/main-process/environment.ts
	$(MAKE) build

package-client: queuebot-client/dist
	cd queuebot-client && npm run make

queuebot/dist: common/index.d.ts queuebot/node_modules
	cd queuebot && npm run build

queuebot/node_modules: queuebot/package.json queuebot/package-lock.json
	cd queuebot && npm ci

# For dev, probably don't need to build until we run the app itself.
queuebot-client/dist: common/index.d.ts queuebot-client/node_modules queuebot-client/src/environments/environment.ts queuebot-client/main-process/environment.ts
	cd queuebot-client && npm run build

queuebot-client/node_modules: queuebot-client/package.json queuebot-client/package-lock.json
	cd queuebot-client && npm ci

queuebot-overlay/dist: common/index.d.ts queuebot-overlay/node_modules queuebot-overlay/src/environments/environment.ts
	cd queuebot-overlay && npm run build

queuebot-overlay/node_modules: queuebot-client/package.json queuebot-client/package-lock.json
	cd queuebot-overlay && npm ci

queuebot-overlay/src/environments/environment.ts: .env queuebot-overlay/src/environments/environment.ts.dist
	export $$(cat .env | xargs) && envsubst < queuebot-overlay/src/environments/environment.ts.dist > queuebot-overlay/src/environments/environment.ts

common/index.d.ts: common/node_modules common/index.ts
	cd common && npx tsc -p ./tsconfig.json

common/node_modules: common/package.json common/package-lock.json
	cd common && npm ci

queuebot/.env: .env queuebot/.env.dist
	export $$(cat .env | xargs) && envsubst < queuebot/.env.dist > queuebot/.env

queuebot-client/src/environments/environment.ts: .env queuebot-client/src/environments/environment.ts.dist
	export $$(cat .env | xargs) && envsubst < queuebot-client/src/environments/environment.ts.dist > queuebot-client/src/environments/environment.ts

queuebot-client/main-process/environment.ts: queuebot-client/src/environments/environment.ts
	cp queuebot-client/src/environments/environment.ts queuebot-client/main-process/environment.ts

start-server: queuebot/.env queuebot/node_modules
	cd queuebot && npm run start:dev

start-client: queuebot-client/src/environments/environment.ts queuebot-client/main-process/environment.ts queuebot-client/node_modules
	cd queuebot-client && npm run electron-tsc-dev

test:
	cd queuebot && npm run test:cov

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
  	common/tsconfig.tsbuildinfo \
  	queuebot/.env \
  	queuebot-client/src/environments/environment.ts \
  	queuebot-client/main-process/environment.ts
