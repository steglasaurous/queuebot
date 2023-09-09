/*
 * This is a small script to turn a CSV into typeorm queryRunner statements.
 * This is for loading OSTs into a migration from a manual source.  I used it to load
 * Audio Trip OSTs from a spreadsheet I put together myself.
 *
 * It's not perfect, but at least eliminated some manual work on my part.
 */

import * as fs from 'fs';
import crypto from "node:crypto";

const input = fs.readFileSync('audio_trip_ost.csv');

const lines = input.toString().split("\n");

let output = '';
lines.forEach((line) => {
    if (line == '') {
        return;
    }
    const row = line.split(',');
    const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify('audio_trip' + row[0] + row[1] + row[2]))
        .digest('hex');

    output += "await queryRunner.query(\"INSERT INTO song (songHash, title, artist, mapper, duration, bpm, gameId) VALUES ";

    output += `('${hash}','${row[0].replace("'","\\'")}','${row[1]}','${row[2]}',${row[3]},${row[4].trim()},1)");\n`;
});

fs.writeFileSync('audio_trip_ost.ts',output);
