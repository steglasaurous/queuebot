import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1703537138064 implements MigrationInterface {
  name = 'Migration1703537138064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "displayName" character varying NOT NULL, "setGameName" character varying NOT NULL, "twitchCategoryId" character varying NOT NULL, CONSTRAINT "UQ_5d1e08e04b97aa06d671cd58409" UNIQUE ("name"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "song" ("id" SERIAL NOT NULL, "songHash" character varying NOT NULL, "title" character varying NOT NULL, "artist" character varying NOT NULL, "mapper" character varying NOT NULL, "duration" integer, "bpm" integer, "downloadUrl" character varying, "fileReference" character varying, "gameId" integer, CONSTRAINT "UQ_4f2e03f5d2c2e196a9066538511" UNIQUE ("songHash"), CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_request" ("id" SERIAL NOT NULL, "requesterName" character varying NOT NULL, "requestTimestamp" integer NOT NULL, "requestOrder" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "isDone" boolean NOT NULL DEFAULT false, "songId" integer NOT NULL, "channelChannelName" character varying NOT NULL, CONSTRAINT "UQ_db0193cbefd39db62bbd46a212d" UNIQUE ("channelChannelName", "songId"), CONSTRAINT "PK_c2b53ff7f5fc5bf370a3f32ebf8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_bot_state" ("id" SERIAL NOT NULL, "requesterName" character varying NOT NULL, "state" text, "timestamp" integer NOT NULL, "channelChannelName" character varying, CONSTRAINT "PK_1b763a0038f12ae306dd4a9f9f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel" ("channelName" character varying NOT NULL, "inChannel" boolean NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "joinedOn" TIMESTAMP NOT NULL, "queueOpen" boolean NOT NULL DEFAULT true, "leftOn" TIMESTAMP, "lang" character varying NOT NULL DEFAULT 'en', "gameId" integer, CONSTRAINT "PK_5e14b4df8f849a695c6046fe741" PRIMARY KEY ("channelName"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_auth_source" ("id" SERIAL NOT NULL, "authSource" character varying NOT NULL, "authSourceUserId" character varying NOT NULL, "authSourceProfileData" text, "userId" integer, CONSTRAINT "UQ_15e21e7f29b09b5df04adde421e" UNIQUE ("userId", "authSource"), CONSTRAINT "PK_08095b14ec15409502f7d02f844" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "displayName" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "song" ADD CONSTRAINT "FK_1c4da7f8b290d50dc07a9ca6bab" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" ADD CONSTRAINT "FK_4af173bdba31c1f42b5398add20" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" ADD CONSTRAINT "FK_3bbf4ded0801d7055cd0d5473aa" FOREIGN KEY ("channelChannelName") REFERENCES "channel"("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bot_state" ADD CONSTRAINT "FK_ab77da784b7259850927bacf51c" FOREIGN KEY ("channelChannelName") REFERENCES "channel"("channelName") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel" ADD CONSTRAINT "FK_d87d7370a6433219a9b73982070" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth_source" ADD CONSTRAINT "FK_2d0e40a8d133066614dd2c22e9c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    /*
     * Games
     */
    await queryRunner.query(
      `INSERT INTO game ("name", "displayName", "twitchCategoryId", "setGameName") VALUES ('audio_trip', 'Audio Trip', '514866', 'audio trip')`,
    );
    await queryRunner.query(
      `INSERT INTO game ("name", "displayName", "twitchCategoryId", "setGameName") VALUES ('spin_rhythm', 'Spin Rhythm XD', '514201', 'spin rhythm xd')`,
    );

    /*
     * Game OSTs
     */

    // Audio Trip
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('cfb47d92499d864ad95bd05749e8d64d3d9830090dc241158ade6c4255f6360c','Addicted To A Memory','Zedd','OST',293,128,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('abb78845d58dccb09b94ac8d2ef74e00e49f64a1aef9ec5a73c40371f85bdedb','Anemone','Naden','OST',327,123,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('d4dfa4ac73a0c0c16e1cb1854fd262c95a008c8df0aa9f08da85b6958b01c9ed','Back ''N'' Forth','Milano','OST',185,125,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('a95df1a06b107b9fec4b32d20043651bed01624d0127dd07f6799260a3efeee9','Bangarang','Skrillex','OST',212,110,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('efc241d305fb45e7ed72ad765e04cc1204de951ea3df69ff42d7f192c4fac48b','Can''t Take It pt 2','Hot Rod Elegants','OST',164,102,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('1dd7ccb25d06f22b7221616a68806fbf7b172633e7859e6ad3723c50a0ac63d0','Caution (GOOD Remix)','Skrxlla','OST',183,126,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('4a1a41a75c0724e8dbf965ddcd612bf90612c08e2c655addccc806e11046e6cb','Dance Monkey','Tones and I','OST',208,98,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('4e2a77c8f875df4015fea8bfa8e7f9113ce382461dd63a842ff1196328cb8126','Drift','Rafael Frost','OST',193,128,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('75e6beb754db10ad828a92b6c58e041399cb4e43fd4924a5aa7da1d16d097ea8','Everybody Get Up','Ian Post','OST',109,99,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('547fe1e5f83813a3b65bd8825f3e0c73aef6ba7ad31f0698502082cad9150974','Freedom','The Originals','OST',148,118,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('8ea2b6d163f71697e640b45c5f005c6b286e67542b02b966ac70981626e8403f','Gangnam Style','PSY','OST',216,132,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('00fa3b5e9d60e5d96ab4a41979011f2f500051d1267f8d8b26820c54b312a99f','Golden Pineapple','Tolan','OST',159,110,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('eef733ba11a676436c96ee9c9151290180900a558fc7e682ee2dc083b586df21','Hit the Beat','IamDayLight','OST',201,100,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('704344c5732f62b959f22af040de879d5e45c23e75341ccd6eafdd5f0df97976','I''ve Been Thinkin','Dimitrix','OST',213,126,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('5e7ecb83eeb4be0b20de6356ca71c114e1f1b81f23d5a1ef7028dc41309c6f26','Jurassic Snack Pack','Prototyperaptor','OST',375,130,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('1735642c1c2c35ec018a978fc86736cacce23beae1f902cd060793b1b7e192f6','Just Dance','Lady Gaga','OST',238,119,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('0016b66073ca1d62eb26d6c00927160e5e75ead4da1c85e0b1704edb81e57693','Keep My Cool','Benj Heard','OST',175,112,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('bf5f56abe745f54e93549837bb889aad93985517f6769e39198404a1cd7a1000','Krishna','Dropgun','OST',159,128,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('7ea3ed428bb5eb9eefb2f2b4cc4ea3b4d434e46287d83ca962d2bfdc18c1b27e','Makamba','Trobi & Vorwerk','OST',126,108,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('715b70567d4bddfa63676e8684096dac021fd622aa340b316ad1610750cacbbf','Mandala','Blastoyz','OST',349,143,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('20d3e4e8a7c5961a10609bca7e8f35a1a67227643bb75b4b2141995db5927e5a','Mini Me (GOOD Remix)','Skrxlla','OST',140,110,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('35f419cfa5bd72e7545f971652c1d8909719ca4d135521314b398b38590182ea','Mythologica','Ofrin','OST',153,85,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('c214ce00764d54a55f0463547e860cdf93d3fdda00df88f6f462245dde782fa5','Red','Rafael Frost','OST',451,136,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('652ed0cdeef253a18587d2ac0fae591240229598b9115f2fc9e04120b0c97ab3','Satisfaction','Benny Benassi','OST',284,130,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('947e6791281192996f59b50cd5f0e5e7204673b315cd04d67f523296d71ba19c','Show Me','Tiesto, DallasK','OST',169, 128, 1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('d426906809df0bfe875162082180360421ac14abf467d410a4f19a0382b75ddc','SIDthesize','InSine','OST',192,100,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('65f48e663f369172b9ba45462a5f603f1640d74e3ddaf4a5e2581bbcfe5eeb46','Sofi Needs a Ladder','Deadmau5','OST',334,128,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('1b636d149e6d539898e90431727ea5a54880dfa8e017062aec2a763096a131cb','Take It to the Top','Ofrin','OST',198,127,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('22f47f8a22a68dfe65c2fd21d4039d8f0ac331ef35175374395d3d64204b93c4','Technicolor Love','Divine Attraction','OST',212,120,1)`,
    );
    await queryRunner.query(
      `INSERT INTO song ("songHash", title, artist, mapper, duration, bpm, "gameId") VALUES ('1b1d0e2247bfc9b8d0830c657cdd1c634ed46061a9d4aefd8d4a05a64df548e8','X-Type','I KILL PXLS','OST',221,130,1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_auth_source" DROP CONSTRAINT "FK_2d0e40a8d133066614dd2c22e9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel" DROP CONSTRAINT "FK_d87d7370a6433219a9b73982070"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bot_state" DROP CONSTRAINT "FK_ab77da784b7259850927bacf51c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" DROP CONSTRAINT "FK_3bbf4ded0801d7055cd0d5473aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_request" DROP CONSTRAINT "FK_4af173bdba31c1f42b5398add20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song" DROP CONSTRAINT "FK_1c4da7f8b290d50dc07a9ca6bab"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_auth_source"`);
    await queryRunner.query(`DROP TABLE "channel"`);
    await queryRunner.query(`DROP TABLE "user_bot_state"`);
    await queryRunner.query(`DROP TABLE "song_request"`);
    await queryRunner.query(`DROP TABLE "song"`);
    await queryRunner.query(`DROP TABLE "game"`);
  }
}
